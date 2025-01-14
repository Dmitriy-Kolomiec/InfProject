import { Form } from 'antd';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { IDataProduct } from '@/interface/addingProduct/product.interface';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import {
  IAutoModel,
  IAutoTypes,
  IVehicle,
} from '@/interface/addingProduct/options.interface';
import axios from 'axios';
import { notify } from '@/data/utils.common';
import { ITags } from '@/interface/addingProduct/addPartNumber.interface';

interface IProps {
  hideModal?: Dispatch<SetStateAction<boolean>>;
}

export const useAddVehicles = ({ hideModal }: IProps) => {
  const [newType, setNewType] = useState<number>();
  const [newBrand, setNewBrand] = useState<number>();
  const [form] = Form.useForm();
  const [isDisabledFormSubmit, setIsDisabledFormSubmit] =
    useState<boolean>(false);
  const [isOpenModalAddType, setIsOpenModalAddType] = useState<boolean>(false);
  const [isOpenModalAddBrand, setIsOpenModalAddBrand] =
    useState<boolean>(false);
  const [typeId, setTypeId] = useState<number>();
  const [brandId, setBrandId] = useState<number>();
  const [autoTypes, setAutoTypes] = useState<IAutoTypes[]>();
  const [autoBrands, setAutoBrands] = useState<IAutoTypes[]>();
  const [autoModels, setAutoModels] = useState<IAutoModel[]>();
  const { setDataProduct, setShouldShowComponent, dataProduct } =
    useContext(ProductContext);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isOpenModalAddModel, setIsOpenModalAddModel] =
    useState<boolean>(false);
  const [newAutoModel, setNewAutoModel] = useState<number>();
  const [tags, setTags] = useState<ITags[]>([]);

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
  const fetchAutoModel = async (typeId: number, brandId: number) => {
    try {
      const response = await APIRequest.get(
        API_ENDPOINTS.GET_AUTO_MODEL(typeId, brandId),
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
    setTypeId(value);
  };
  useEffect(() => {
    if (newBrand) {
      handleBrandChange(newBrand);
    }
  }, [newBrand]);

  const handleBrandChange = (value: number) => {
    setBrandId(value);
  };

  const onFinish = async (value: IVehicle) => {
    setIsLoader(true);

    const productAutoModel = tags?.map(model => ({
      autoModelId: model.id,
    }));

    const requestBody = {
      productId: dataProduct.product.id,
      productAutoModel: productAutoModel,
    };

    try {
      const { data } = await APIRequest.post(
        API_ENDPOINTS.ADD_PRODUCT_AUTO_MODEL,
        requestBody,
      );
      if (data) {
        setDataProduct((prevData: IDataProduct) => ({
          ...prevData,
          vehicle: data,
        }));
        setShouldShowComponent(state => ({
          ...state,
          showAddingVehicle: false,
        }));
        form.resetFields();
        hideModal?.(false);
        setIsLoader(false);
      }
    } catch (error) {
      console.log('Ошибка при добавлении транспортного средства:', error);
      if (axios.isAxiosError(error) && error.message) {
        setIsLoader(false);
        hideModal?.(false);
        notify('error', {
          message: error.message,
        });
      }
    }
  };
  const hidenAddVehicles = () => {
    setShouldShowComponent(state => ({
      ...state,
      showAddingVehicle: false,
    }));
  };

  return {
    form,
    isDisabledFormSubmit,
    setIsDisabledFormSubmit,
    isOpenModalAddType,
    setIsOpenModalAddType,
    isOpenModalAddBrand,
    setIsOpenModalAddBrand,
    typeId,
    brandId,
    autoTypes,
    autoBrands,
    autoModels,
    fetchAutoTypes,
    fetchAutoBrands,
    fetchAutoModel,
    handleTypeChange,
    handleBrandChange,
    onFinish,
    hidenAddVehicles,
    newType,
    setNewType,
    newBrand,
    setNewBrand,
    isLoader,
    isOpenModalAddModel,
    setIsOpenModalAddModel,
    newAutoModel,
    setNewAutoModel,
    tags,
    handleTagClose,
    handleClearTags,
    onChangeModel,
  };
};
