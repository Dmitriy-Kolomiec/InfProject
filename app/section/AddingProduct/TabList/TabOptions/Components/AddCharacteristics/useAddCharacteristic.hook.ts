import { useContext, useState } from 'react';
import { Form } from 'antd';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { useSearchParams } from 'next/navigation';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { IDataProduct } from '@/interface/addingProduct/product.interface';
import {
  IAddProperties,
  IProperty,
} from '@/interface/addingProduct/options.interface';
import axios from 'axios';
import { notify } from '@/data/utils.common';

interface IProps {
  closeDrawer?: () => void;
}

export const useAddCharacteristic = ({ closeDrawer }: IProps) => {
  const [newProperty, setNewProperty] = useState<number>();
  const [form] = Form.useForm();
  const [valueCount, setValueCount] = useState<number>(0);
  const [fileIds, setFileIds] = useState<{ [key: number]: number[] }>({});

  const searchParams = useSearchParams();
  const activeTab: string | null = searchParams.get('tab');
  const { setDataProduct, setShouldShowComponent, dataProduct } =
    useContext(ProductContext);
  const [isDisabledFormSubmit, setIsDisabledFormSubmit] =
    useState<boolean>(false);
  const [isOpenModalAddCharacteristics, setIsOpenModalAddCharacteristics] =
    useState<boolean>(false);
  const [propirties, setProperties] = useState<IProperty[]>([]);
  const [isLoader, setIsLoader] = useState<boolean>(false);

  const fetchProperties = async () => {
    const res = await APIRequest.get<IProperty[]>(API_ENDPOINTS.GET_PROPERTIES);
    setProperties(res.data);
  };

  const handleSubmitAddCharacteristic = async (value: IAddProperties) => {
    setIsLoader(true);
    const propertyValues = value.propertyValues?.map((item, index) => ({
      value: item.value,
      description: item.description,
      fileIds: fileIds[index],
    }));

    const requestBody = {
      productId: dataProduct.product.id,
      propertyId: value.propertyId,
      propertyValues: propertyValues,
    };

    try {
      const { data } = await APIRequest.post(
        API_ENDPOINTS.ADD_PROPERTIES_PRODUCT,
        requestBody,
      );
      if (data) {
        setDataProduct((state: IDataProduct) => ({
          ...state,
          properties: [...(state.properties || []), data],
        }));
        setShouldShowComponent(state => ({
          ...state,
          showAddingProperties: false,
        }));
        setIsLoader(false);

        closeDrawer?.();
        form.resetFields();
      }
    } catch (error) {
      console.error('Ошибка при создании новой характеристики:', error);
      if (axios.isAxiosError(error) && error.message) {
        setIsLoader(false);
        closeDrawer?.();
        notify('error', {
          message: error.message,
        });
      }
    }
  };

  const hidenAddingCategory = () => {
    setShouldShowComponent(state => ({
      ...state,
      showAddingProperties: false,
    }));
    form.resetFields();
  };

  return {
    form,
    valueCount,
    setValueCount,
    activeTab,
    isDisabledFormSubmit,
    setIsDisabledFormSubmit,
    isOpenModalAddCharacteristics,
    setIsOpenModalAddCharacteristics,
    propirties,
    fetchProperties,
    handleSubmitAddCharacteristic,
    hidenAddingCategory,
    setFileIds,
    newProperty,
    setNewProperty,
    isLoader,
  };
};
