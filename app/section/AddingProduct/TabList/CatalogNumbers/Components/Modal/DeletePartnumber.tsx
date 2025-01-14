import { Button } from 'antd';
import styles from './modal.module.css';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { ITableData } from '@/interface/addingProduct/partNumbers.interface';
import axios from 'axios';
import { notify } from '@/data/utils.common';

interface IProps {
  aboutPartNumber: ITableData;
  hideModal: Dispatch<SetStateAction<boolean>>;
}

export const DeletePartnumber = ({ aboutPartNumber, hideModal }: IProps) => {
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const { setDataProduct } = useContext(ProductContext);
  const { partNumberId, partnumber } = aboutPartNumber;

  const deletePartNumber = async (id: string) => {
    setIsLoader(true);
    console.log('Удаление каталожного номера: ', id);
    try {
      const response = await APIRequest.delete(
        API_ENDPOINTS.DELETE_PARTNUMBER(id),
      );

      setDataProduct(state => ({
        ...state,

        partNumbers: response.data,
      }));
      setIsLoader(false);
      hideModal(false);
    } catch (error) {
      console.error('Ошибка при удалении каталожного номера:', error);
      if (axios.isAxiosError(error) && error.message) {
        setIsLoader(false);
        hideModal(false);
        notify('error', {
          message: error.message,
        });
      }
    }
  };
  return (
    <>
      <div className={styles.subtitle}>Вы удаляете каталожный номер:</div>
      <div className={styles.nameCategory}>{partnumber}</div>

      <div>Вместе с каталожным номером будут удалены все его атрибуты.</div>

      <div className={styles.buttonWrapper}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
          Не удалять
        </Button>
        <Button
          className="button-primary"
          onClick={() => deletePartNumber(partNumberId)}
          loading={isLoader}
        >
          Удалить
        </Button>
      </div>
    </>
  );
};
