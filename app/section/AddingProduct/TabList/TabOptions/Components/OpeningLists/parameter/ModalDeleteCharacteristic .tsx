import { Button } from 'antd';
import styles from './listOpenCharacteristic.module.css';
import { Dispatch, SetStateAction, useContext } from 'react';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { IProperties } from '@/interface/addingProduct/options.interface';
import axios from 'axios';
import { notify } from '@/data/utils.common';

interface IProps {
  propertyProductId: number;
  property: string;
  unit?: string;
  hideModal: Dispatch<SetStateAction<boolean>>;
}

export const ModalDeleteCharacteristic = ({
  propertyProductId,
  property,
  unit,
  hideModal,
}: IProps) => {
  const { setDataProduct } = useContext(ProductContext);
  const deleteCharacteristic = async (id: number) => {
    try {
      await APIRequest.delete(API_ENDPOINTS.DELETE_PROPERTY(id.toString()));
      setDataProduct(state => ({
        ...state,
        properties: state.properties?.filter(
          (item: IProperties) => item.propertyProductId !== id,
        ),
      }));
      console.log('Удаление характеристики c id: ', id);
      hideModal(false);
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error) && error.message) {
        hideModal(false);
        notify('error', {
          message: error.message,
        });
      }
    }
  };
  return (
    <div>
      <div className={styles.subtitle}>Вы удаляете характеристику:</div>
      <div className={styles.nameCharacteristic}>
        {property} {unit && `,${unit}`}
      </div>
      <div>
        Вместе с характеристикой будут удалены все добавленные значения.
      </div>

      <div className={styles.buttonWrapper}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
          Не удалять
        </Button>
        <Button
          className="button-primary"
          onClick={() => deleteCharacteristic(propertyProductId)}
        >
          Удалить
        </Button>
      </div>
    </div>
  );
};
