import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { API_ENDPOINTS } from '@/data/api/api.data';
import APIRequest from '@/data/api/api.utils';
import { notify } from '@/data/utils.common';
import { IConnections } from '@/interface/addingProduct/connections.inteface';
import { Form } from 'antd';
import axios from 'axios';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useContext, useState } from 'react';
interface AdditionalPropertyValue {
  propertyValuesId: number;
}

interface RelatedPropertyValue {
  propertyValuesId: number;
  relatedPropertyValuesIds?: AdditionalPropertyValue[];
  type: string;
  isFully?: string;
  description?: string;
}

interface Values {
  propertyValuesId: number;
  additionalPropertyValuesId?: AdditionalPropertyValue[];
  relatedPropertyValues: RelatedPropertyValue[];
}

export const useEditRelations = () => {
  const [isOpenModalAddRelatedProduct, setIsOpenModalAddRelatedProduct] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const pathname = usePathname();
  const { dataProduct, setShouldShowComponent, setDataProduct } =
    useContext(ProductContext);
  const searchParams = useSearchParams();
  const relationEdit: string | null = searchParams.get('relationEdit');
  const activeTab: string | null = searchParams.get('tab');
  const productId: string | null = searchParams.get('productId');
  const editPropertyValueIds = relationEdit?.split(',').map(Number);
  const [editRelation, setEditRelation] = useState<IConnections | null>(null);
  const [relatedProduct, setRelatedProduct] =
    useState<{ id: number; name: string }[]>();
  const initialRelatedProduct = editRelation?.relatedPropertyValues;

  const onFinish = async (values: Values) => {
    const mainPropertyValuesId = values.propertyValuesId;
    const additionalPropertyValuesIds = values.additionalPropertyValuesId
      ? values.additionalPropertyValuesId.map(item => item.propertyValuesId)
      : [];

    const propertyValuesIds = [
      mainPropertyValuesId,
      ...additionalPropertyValuesIds,
    ];

    const relatedPropertyValues = values.relatedPropertyValues.map(
      (relatedValue, index) => {
        const additionalRelatedValues = relatedValue.relatedPropertyValuesIds
          ? relatedValue.relatedPropertyValuesIds.map(
              item => item.propertyValuesId,
            )
          : [];

        const propertyValuesIds = [
          relatedValue.propertyValuesId,
          ...additionalRelatedValues,
        ];

        const formateType = (type: string) => {
          if (type === 'Совместимость') {
            return 'compatibility';
          }
          if (type === 'Многосоставность') {
            return 'inclusion';
          }
          if (type === 'Зависимость') {
            return 'affection';
          }

          return type;
        };

        const result = {
          propertyValuesIds,
          type: formateType(relatedValue.type),
          description: relatedValue.description || '',
          isFully: relatedValue.isFully === 'true',
          relationsId: editRelation?.relatedPropertyValues[index]?.relation.id,
        };

        if (relatedValue.type === 'compatibility') {
          result.isFully = relatedValue.isFully === 'true';
        }

        return result;
      },
    );

    const requestBody = {
      productId: dataProduct.product.id,
      propertyValuesIds,
      relatedPropertyValues,
    };
    try {
      const { data } = await APIRequest.put(
        API_ENDPOINTS.EDIT_PRODUCT_CONNECTION,
        requestBody,
      );
      setDataProduct(state => ({
        ...state,
        connections: data.connections,
      }));
      hideEditingRelations();
    } catch (error) {
      console.error('Ошибка при создании каталожного номера:', error);
      if (axios.isAxiosError(error) && error.message) {
        notify('error', {
          message: error.message,
        });
      }
    }
  };

  const hideEditingRelations = () => {
    setShouldShowComponent(state => ({
      ...state,
      showEditRelations: false,
    }));
    form.resetFields();
    onCloseDrawer();
  };

  const onCloseDrawer = () => {
    const params = new URLSearchParams();
    if (activeTab !== null) {
      params.set('tab', activeTab);
    }
    if (productId !== null) {
      params.set('productId', productId);
    }
    router.push(pathname + '?' + params.toString());
  };

  return {
    isOpenModalAddRelatedProduct,
    setIsOpenModalAddRelatedProduct,
    form,
    dataProduct,
    relationEdit,
    editPropertyValueIds,
    editRelation,
    setEditRelation,
    relatedProduct,
    setRelatedProduct,
    initialRelatedProduct,
    onFinish,
    hideEditingRelations,
  };
};
