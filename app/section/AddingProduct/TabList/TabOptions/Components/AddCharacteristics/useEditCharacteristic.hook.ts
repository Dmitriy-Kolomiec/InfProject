import { useContext, useState } from 'react';
import { Form } from 'antd';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { IDataProduct } from '@/interface/addingProduct/product.interface';
import {
  IAddProperties,
  IProperty,
} from '@/interface/addingProduct/options.interface';

export const useEditCharacteristic = () => {
  const [newEditProperty, setNewEditProperty] = useState<number>();
  const [form] = Form.useForm();
  const [valueCount, setValueCount] = useState<number>(0);
  const searchParams = useSearchParams();
  const activeTab: string | null = searchParams.get('tab');
  const [fileIds, setFileIds] = useState<{ [key: number]: number[] }>({});
  const productId: string | null = searchParams.get('productId');
  const editPropertyProductId: string | null = searchParams.get('propertyEdit');
  const { setShouldShowComponent, dataProduct, setDataProduct } =
    useContext(ProductContext);
  const router = useRouter();
  const pathname = usePathname();

  const editProperty = dataProduct.properties?.filter(
    item => item.propertyProductId === Number(editPropertyProductId),
  );
  const [isDisabledFormSubmit, setIsDisabledFormSubmit] =
    useState<boolean>(false);
  const [isOpenModalAddCharacteristics, setIsOpenModalAddCharacteristics] =
    useState<boolean>(false);
  const [properties, setProperties] = useState<IProperty[]>([]);

  const fetchProperties = async () => {
    const res = await APIRequest.get<IProperty[]>(API_ENDPOINTS.GET_PROPERTIES);
    setProperties(res.data);
  };
  const clearQueryPropertyEdit = () => {
    const params = new URLSearchParams();
    if (activeTab !== null) {
      params.set('tab', activeTab);
    }
    if (productId !== null) {
      params.set('productId', productId);
    }

    router.push(pathname + '?' + params.toString());
  };

  const onFinish = async (value: IAddProperties) => {
    const propertyValues = value.propertyValues?.map((item, index) => ({
      propertyValuesId: item.propertyValuesId,
      value: item.value,
      description: item.description,
      fileIds: fileIds[index],
    }));

    const requestBody = {
      propertyId: value.propertyId,
      propertyProductId: Number(editPropertyProductId),
      propertyValues: propertyValues,
    };

    try {
      const response = await APIRequest.put(
        API_ENDPOINTS.EDIT_PROPERTIES,
        requestBody,
      );
      setDataProduct((state: IDataProduct) => ({
        ...state,
        properties: (state.properties || []).map(property => {
          if (property.propertyProductId === Number(editPropertyProductId)) {
            // Обновляем только данные редактируемой характеристики
            return {
              ...property,
              propertyValues: response.data.propertyValues,
            };
          }
          return property;
        }),
      }));

      setShouldShowComponent(state => ({
        ...state,
        showEditProperties: false,
      }));
      clearQueryPropertyEdit();
      form.resetFields();
    } catch (error) {
      console.error('Ошибка при редактировании характеристик:', error);
    }
  };
  const CHECKING_FIELDS_NAME = ['propertyId'];

  return {
    form,
    valueCount,
    setValueCount,
    activeTab,
    setFileIds,
    editPropertyProductId,
    setShouldShowComponent,
    dataProduct,
    editProperty,
    isDisabledFormSubmit,
    setIsDisabledFormSubmit,
    isOpenModalAddCharacteristics,
    setIsOpenModalAddCharacteristics,
    properties,
    fetchProperties,
    onFinish,
    clearQueryPropertyEdit,
    CHECKING_FIELDS_NAME,
    newEditProperty,
    setNewEditProperty,
  };
};
