import { Dispatch, SetStateAction, useContext } from 'react';
import styles from './listOpenRelations.module.css';
import { Button } from 'antd';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import axios from 'axios';
import { notify } from '@/data/utils.common';

interface IProps {
  hideModal: Dispatch<SetStateAction<boolean>>;
  relatedProductId: number;
}

export default function DeleteRelatedProduct({
  hideModal,
  relatedProductId,
}: IProps) {
  const { setDataProduct } = useContext(ProductContext);

  const deleteRelatedProduct = async (id: number) => {
    try {
      const { data } = await APIRequest.delete(
        API_ENDPOINTS.DELETE_RELATED_PRODUCT(id),
      );
      setDataProduct(state => ({
        ...state,

        connections: data.connections,
      }));
      hideModal(false);
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error) && error.message) {
        notify('error', {
          message: error.message,
        });
      }
    }
  };

  return (
    <>
      <div>Вы уверены что хотите удалить данный товар из связи?</div>
      <div className={styles.buttonWrapper}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
          Не удалять
        </Button>
        <Button
          className="button-primary"
          onClick={() => deleteRelatedProduct(relatedProductId)}
        >
          Удалить
        </Button>
      </div>
    </>
  );
}
