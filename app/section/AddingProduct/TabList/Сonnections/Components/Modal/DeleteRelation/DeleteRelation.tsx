import { Dispatch, SetStateAction, useContext } from 'react';
import styles from './deleteRelation.module.css';
import { Button } from 'antd';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import {
  IConnections,
  IRelatedProperty,
} from '@/interface/addingProduct/connections.inteface';
import { notify } from '@/data/utils.common';
import axios from 'axios';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';

interface IProps {
  hideModal: Dispatch<SetStateAction<boolean>>;
  relation: IConnections;
}

export default function DeleteRelation({ hideModal, relation }: IProps) {
  const { dataProduct, setDataProduct } = useContext(ProductContext);
  const deleteRelation = async (property: IRelatedProperty[]) => {
    const propertyValuesIds = property.map(p => p.relation.id);

    const params = {
      parameters: {
        relationsIds: propertyValuesIds, // Передача properties values ids основного продукта происходит обязательно массивом
      },
    };
    // Преобразование объекта в JSON-строку
    const jsonString = JSON.stringify(params);

    // Кодирование JSON-строки для использования в URL
    const encodedString = encodeURIComponent(jsonString);
    try {
      const { data } = await APIRequest.delete(
        API_ENDPOINTS.DELETE_RELATION_PRODUCT(encodedString),
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
      <div className={styles.subtitle}>Вы хотите удалить связи товара:</div>
      <div>{dataProduct.product.name}</div>

      <div>
        {relation.propertyValue.map(p => (
          <div key={p.relationPropertyValueId}>
            <span>
              {p.property} {p.unit && `,${p.unit}`} / {p.value}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.text}>
        Все настроенные связи с другими товарами будут удалены.
      </div>

      <div className={styles.buttonWrapper}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
          Не удалять
        </Button>
        <Button
          className="button-primary"
          onClick={() => deleteRelation(relation.relatedPropertyValues)}
        >
          Удалить
        </Button>
      </div>
    </>
  );
}
