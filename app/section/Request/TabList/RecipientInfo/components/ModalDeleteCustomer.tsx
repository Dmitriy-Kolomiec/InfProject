import { Button, FormInstance } from 'antd';
import styles from './components.module.css';
import { Dispatch, SetStateAction, useContext } from 'react';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { notify } from '@/data/utils.common';
import axios from 'axios';
import { ICustomer } from '@/interface/request/request.interface';
import { RequestContext } from '@/context/Request/request.context';
interface IProps {
  id?: number;
  customerName?: string;
  hideModal: Dispatch<SetStateAction<boolean>>;
  form: FormInstance<any>;
  setSelectedCustomer: Dispatch<SetStateAction<ICustomer | null>>;
  fetchCustomers: () => Promise<void>;
  setInitialCustomer: Dispatch<SetStateAction<ICustomer | null>>;
}

export const DeleteCustomerModal = ({
  id,
  customerName,
  hideModal,
  form,
  setSelectedCustomer,
  fetchCustomers,
  setInitialCustomer,
}: IProps) => {
  const { setDataRequest } = useContext(RequestContext);

  const deleteCustomer = async (id?: number) => {
    if (id) {
      try {
        await APIRequest.delete(API_ENDPOINTS.DELETE_CUSTOMER(id));
        setSelectedCustomer(null);
        setInitialCustomer(null);
        setDataRequest({});
        form.resetFields(['customer']);
        fetchCustomers();
      } catch (error) {
        console.error('Ошибка удаления покупателя:', error);
        if (axios.isAxiosError(error) && error.message) {
          notify('error', {
            message: error.message,
          });
        }
      }
    }
  };

  return (
    <>
      <div className={styles.subtitle}>Вы удаляете покупателя:</div>
      <div className={styles.nameCategory}>{customerName}</div>
      <div className={styles.buttonsModal}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
          Не удалять
        </Button>
        <Button className="button-primary" onClick={() => deleteCustomer(id)}>
          Удалить
        </Button>
      </div>
    </>
  );
};
