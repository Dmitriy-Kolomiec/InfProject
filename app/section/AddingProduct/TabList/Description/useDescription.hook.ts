import { useContext, useState } from 'react';
import { Form } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { API_ENDPOINTS } from '@/data/api/api.data';
import APIRequest from '@/data/api/api.utils';
import { APP_PATHS } from '@/data/paths.data';
import {
  IDataProduct,
  IProduct,
} from '@/interface/addingProduct/product.interface';
import { notify } from '@/data/utils.common';
import axios from 'axios';
export const useDescription = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { setDataProduct } = useContext(ProductContext);
  const searchParams = useSearchParams();
  const productId: string | null = searchParams.get('productId');
  const [fileIdsDescription, setFileIdsDescription] = useState<number[]>([]);
  const [isLoader, setIsLoader] = useState<boolean>(false);

  const onCreateSubmitDescription = async (value: IProduct) => {
    setIsLoader(true);
    const { name, additionalNames, description } = value;
    const requestBody = {
      name,
      additionalNames,
      description,
      fileIds: fileIdsDescription,
    };
    try {
      const response = await APIRequest.post(
        API_ENDPOINTS.ADD_PRODUCT,
        requestBody,
      );

      const productId: string = response.data.productId;

      setDataProduct((prevState: IDataProduct) => ({
        ...prevState,
        product: (prevState.product.id = response.data.productId),
      }));

      router.push(
        APP_PATHS.EDIT_PRODUCT +
          '?' +
          new URLSearchParams({
            tab: 'options',
            productId: productId,
          }).toString(),
      );
      console.log('Создание нового продукта с id:', productId);
      setIsLoader(false);
    } catch (error) {
      console.error('Ошибка при создании нового товара', error);
      if (axios.isAxiosError(error) && error.message) {
        notify('error', {
          message: error.message,
        });
      }
      setIsLoader(false);
    }
  };
  const onEditSubmitDescription = async (value: IProduct) => {
    setIsLoader(true);
    const { name, additionalNames, description } = value;
    const requestBody = {
      id: Number(productId),
      name,
      additionalNames,
      description,
      fileIds: fileIdsDescription,
    };
    try {
      const response = await APIRequest.put(
        API_ENDPOINTS.SAVE_PRODUCT,
        requestBody,
      );

      setDataProduct((prevState: IDataProduct) => ({
        ...prevState,
        product: (prevState.product.id = response.data.productId),
      }));

      router.push(
        APP_PATHS.EDIT_PRODUCT +
          '?' +
          new URLSearchParams({
            tab: 'options',
            productId: productId!,
          }).toString(),
      );
      console.log('Редактирование продукта с id:', productId);
      setIsLoader(false);
    } catch (error) {
      console.error('Ошибка при редактирование нового товара', error);
      if (axios.isAxiosError(error) && error.response?.data.message) {
        notify('error', {
          message: error.response.data.message,
        });
      }
      setIsLoader(false);
    }
  };
  return {
    form,
    router,
    isDisabled,
    setIsDisabled,
    productId,
    setFileIdsDescription,
    onCreateSubmitDescription,
    onEditSubmitDescription,
    isLoader,
  };
};
