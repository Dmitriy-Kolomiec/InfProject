import { Button } from 'antd';
import styles from './modal.module.css';
import { Dispatch, SetStateAction } from 'react';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';

interface IProps {
  hideModal: Dispatch<SetStateAction<boolean>>;
  fetchDataProducts?: any;
  productId?: number;
}

export const DeleteProductModal = ({
  hideModal,
  fetchDataProducts,
  productId,
}: IProps) => {
  const onSubmitDeleteProduct = async (id: number) => {
    try {
      await APIRequest.delete(API_ENDPOINTS.DELETE_PRODUCT(id));
      hideModal(false);
      fetchDataProducts();
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
    }
  };
  return (
    <>
      {productId && (
        <>
          <div>Вы действительно хотите удалить выбранный продукт?</div>
          <div className={styles.buttonWrapper}>
            <Button
              className="button-transparent"
              onClick={() => hideModal(false)}
            >
              Не удалять
            </Button>
            <Button
              className="button-primary"
              onClick={() => onSubmitDeleteProduct(productId)}
            >
              Удалить
            </Button>
          </div>
        </>
      )}
    </>
  );
};
