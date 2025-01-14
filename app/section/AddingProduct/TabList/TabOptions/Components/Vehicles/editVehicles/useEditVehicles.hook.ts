import { Form } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { IDataProduct } from '@/interface/addingProduct/product.interface';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  IAutoModel,
  IAutoTypes,
  IVehicle,
} from '@/interface/addingProduct/options.interface';
import axios from 'axios';
import { notify } from '@/data/utils.common';
import { ITags } from '@/interface/addingProduct/addPartNumber.interface';

export const useEditVehicles = () => {
  const [form] = Form.useForm();
  const { setDataProduct, setShouldShowComponent, dataProduct } =
    useContext(ProductContext);
  const [autoModels, setAutoModels] = useState<IAutoModel[]>();
  const [initialDescriptions, setInitialDescriptions] = useState<string[]>([]);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab: string | null = searchParams.get('tab');
  const productId: string | null = searchParams.get('productId');
  const [tags, setTags] = useState<ITags[]>([]);
  const editVehicleProductId: string | null = searchParams.get('vehicleEdit');
  const [newType, setNewType] = useState<number>();
  const [newBrand, setNewBrand] = useState<number>();
  const [isDisabledFormSubmit, setIsDisabledFormSubmit] =
    useState<boolean>(false);
  const [isOpenModalAddType, setIsOpenModalAddType] = useState<boolean>(false);
  const [isOpenModalAddBrand, setIsOpenModalAddBrand] =
    useState<boolean>(false);
  const [type, setType] = useState<number>();
  const [brandId, setBrand] = useState<number>();
  const [autoTypes, setAutoTypes] = useState<IAutoTypes[]>();
  const [autoBrands, setAutoBrands] = useState<IAutoTypes[]>();
  const [isOpenModalAddModel, setIsOpenModalAddModel] =
    useState<boolean>(false);
  const [newAutoModel, setNewAutoModel] = useState<number>();

  const handleTagClose = (tagToRemove: ITags) => {
    const updatedTags = tags.filter(tag => tag.id !== tagToRemove.id);
    setTags(updatedTags);
    if (tags.length <= 0) {
      form.resetFields(['autoModelsIds']);
    }
  };

  const handleClearTags = () => {
    setTags([]);
    form.resetFields(['model']);
  };

  const onChangeModel = (_: string, option: any) => {
    if (option) {
      const newTags = option.map((o: any) => ({
        id: o.value,
        name: o.label,
      }));
      setTags(newTags);
    }
  };
  const fetchAutoTypes = async () => {
    try {
      const response = await APIRequest.get(API_ENDPOINTS.GET_AUTO_TYPES);
      setAutoTypes(response.data);
    } catch (error) {
      console.error('Ошибка при получении типов автомобилей:', error);
    }
  };

  const fetchAutoBrands = async () => {
    try {
      const response = await APIRequest.get(API_ENDPOINTS.GET_AUTO_BRANDS);
      setAutoBrands(response.data);
    } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
    }
  };
  const fetchAutoModel = async (
    typeId: number,
    brandId: number,
    productId?: string,
  ) => {
    try {
      const response = await APIRequest.get(
        API_ENDPOINTS.GET_AUTO_MODEL(typeId, brandId, productId),
      );
      setAutoModels(response.data);
    } catch (error) {
      console.error('Ошибка при получении моделей автомобилей:', error);
    }
  };

  useEffect(() => {
    if (newType) {
      handleTypeChange(newType);
    }
  }, [newType]);
  const handleTypeChange = (value: number) => {
    setType(value);
  };
  useEffect(() => {
    if (newBrand) {
      handleBrandChange(newBrand);
    }
  }, [newBrand]);

  const handleBrandChange = (value: number) => {
    setBrand(value);
  };

  const onFinish = async (value: IVehicle) => {
    setIsLoader(true);
    const productAutoModel = tags?.map(model => ({
      id: model.id,
    }));

    const requestBody = {
      productId: dataProduct.product.id,
      autoModel: productAutoModel,
    };
    try {
      const { data } = await APIRequest.put(
        API_ENDPOINTS.EDIT_PRODUCT_AUTO_MODEL,
        requestBody,
      );

      setDataProduct((prevData: IDataProduct) => ({
        ...prevData,
        vehicle: data,
      }));
      setShouldShowComponent(state => ({
        ...state,
        showEditVehicle: false,
      }));
      setIsLoader(false);
      form.resetFields();
    } catch (error) {
      console.log('Ошибка при редактировании транспортного средства:', error);
      if (axios.isAxiosError(error) && error.message) {
        setIsLoader(false);

        notify('error', {
          message: error.message,
        });
      }
    }
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
  const hidenEditVehicles = () => {
    setShouldShowComponent(state => ({
      ...state,
      showEditVehicle: false,
    }));
    clearQueryPropertyEdit();
  };

  return {
    form,
    dataProduct,
    autoModels,
    editVehicleProductId,
    fetchAutoModel,
    onFinish,
    hidenEditVehicles,
    isLoader,
    setNewType,
    newBrand,
    newType,
    setNewBrand,
    isDisabledFormSubmit,
    setIsDisabledFormSubmit,
    isOpenModalAddType,
    setIsOpenModalAddType,
    isOpenModalAddBrand,
    setIsOpenModalAddBrand,
    typeId: type,
    brandId,
    autoTypes,
    autoBrands,
    isOpenModalAddModel,
    setIsOpenModalAddModel,
    newAutoModel,
    setNewAutoModel,
    handleTagClose,
    handleClearTags,
    onChangeModel,
    fetchAutoTypes,
    fetchAutoBrands,
    handleTypeChange,
    handleBrandChange,
    tags,
    setTags,
  };
};
