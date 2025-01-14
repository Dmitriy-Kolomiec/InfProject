import { FormInstance } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  IAddManufacturer,
  ITags,
} from '@/interface/addingProduct/addPartNumber.interface';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import {
  IAutoModel,
  IAutoTypes,
} from '@/interface/addingProduct/options.interface';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface IQueryFilter {
  autoType?: string;
  autoBrand?: string;
  autoModels?: (string | undefined)[];
  manufacturers?: string[];
  price?: string;
  isOnlyInStock?: boolean;
  tab: string | undefined;
}

interface IProps {
  form: FormInstance<any>;
  hideModal: Dispatch<SetStateAction<boolean>>;
  setCountFilter: Dispatch<SetStateAction<number>>;
  tagsModel: ITags[];
  setTagsModel: Dispatch<SetStateAction<ITags[]>>;
  tagsManufacturers: ITags[];
  setTagsManufacturers: Dispatch<SetStateAction<ITags[]>>;
  isOrderFormation: boolean;
}

export const useFilterTop = ({
  form,
  setCountFilter,
  hideModal,
  tagsModel,
  setTagsModel,
  tagsManufacturers,
  setTagsManufacturers,
  isOrderFormation,
}: IProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [autoTypes, setAutoTypes] = useState<IAutoTypes[]>();
  const [autoBrands, setAutoBrands] = useState<IAutoTypes[]>();
  const [autoModels, setAutoModels] = useState<IAutoModel[]>();
  const [manufacturers, setManufacturers] = useState<IAddManufacturer[]>();
  const [labelType, setLabelType] = useState<string>();
  const [labelBrand, setLabelBrand] = useState<string>();

  const initializeForm = async () => {
    const autoType = searchParams.get('autoType') || undefined;
    const autoBrand = searchParams.get('autoBrand') || undefined;
    const autoModels = searchParams.get('autoModels')?.split(',') || [];
    const manufacturers = searchParams.get('manufacturers')?.split(',') || [];

    form.setFieldsValue({
      isOnlyStock: searchParams.get('isOnlyInStock') || 'false',
      type: autoType,
      priceStart: searchParams.get('price')?.split('-')[0] || undefined,
      priceEnd: searchParams.get('price')?.split('-')[1] || undefined,
    });

    if (manufacturers.length > 0) {
      setTagsManufacturers(
        manufacturers.map(manufacturer => ({
          label: manufacturer,
          name: manufacturer,
        })),
      );
    }

    if (autoType) {
      setLabelType(autoType);
      await fetchAutoBrands(autoType);
      form.setFieldsValue({
        brand: autoBrand,
      });
    }

    if (autoType && autoBrand) {
      setLabelBrand(autoBrand);
      await fetchAutoModel(autoType, autoBrand);
      setTagsModel(autoModels.map(model => ({ label: model, name: model })));
    }
  };

  const changeFilterQuery = (query: IQueryFilter) => {
    // Подсчет активных фильтров
    const activeFilters = [
      query.autoType,
      query.autoBrand,
      query.autoModels && query.autoModels.length > 0 ? query.autoModels : null,
      query.isOnlyInStock !== undefined ? query.isOnlyInStock : null,
      query.manufacturers && query.manufacturers.length > 0
        ? query.manufacturers
        : null,
      query.price ? query.price : null,
      query.tab ? query.tab : null,
    ].filter(Boolean).length;

    setCountFilter(activeFilters);
    const queryString = new URLSearchParams();

    const queryParamsMap = {
      tab: query.tab,
      autoType: query.autoType,
      autoBrand: query.autoBrand,
      autoModels: query.autoModels?.join(','),
      isOnlyInStock: query.isOnlyInStock?.toString(),
      manufacturers: query.manufacturers?.join(','),
      price: query.price,
    };

    Object.entries(queryParamsMap).forEach(([key, value]) => {
      if (value) {
        queryString.set(key, value);
      }
    });

    router.push(`${pathname}?${queryString.toString()}`);
    hideModal(false);
  };

  const onFinish = (value: any) => {
    const query: IQueryFilter = {
      tab: isOrderFormation ? 'formation' : undefined,
      autoType: value.type,
      autoBrand: value.brand,
      autoModels: tagsModel?.map(tag => tag.label) || [],
      price: `${value.priceStart || 0}-${value.priceEnd || 999000000}`,
      isOnlyInStock: value.isOnlyStock === 'true',
      manufacturers: tagsManufacturers?.map(tag => tag.name) || [],
    };

    changeFilterQuery(query);
  };

  // TAGS
  const handleTypeChange = (value: string) => {
    setLabelType(value);
  };
  const handleBrandChange = (value: string) => {
    handleClearTagsModel();
    setLabelBrand(value);
  };
  const handleModelChange = (_: number, option: any) => {
    if (option) {
      const newTags = option.map((o: any) => ({
        id: o.key,
        name: o.label,
        label: o.value,
      }));
      setTagsModel(newTags);
    }
  };
  const handleManufactureChange = (_: number, option: any) => {
    if (option) {
      const newTags = option.map((o: any) => ({
        id: o.key,
        name: o.label,
      }));
      setTagsManufacturers(newTags);
    }
  };

  const handleClearTagsModel = () => {
    setTagsModel([]);
    form.resetFields(['model']);
  };
  const handleClearTagsManufacture = () => {
    setTagsManufacturers([]);
    form.resetFields(['manufacturer']);
  };

  const handleTagCloseModel = (tagToRemove: ITags) => {
    const updatedTags = tagsModel.filter(tag => tag.id !== tagToRemove.id);
    setTagsModel(updatedTags);
    if (tagsModel.length <= 0) {
      form.resetFields(['model']);
    }
  };
  const handleTagCloseManufacture = (tagToRemove: ITags) => {
    const updatedTags = tagsManufacturers.filter(
      tag => tag.id !== tagToRemove.id,
    );
    setTagsManufacturers(updatedTags);
    if (tagsManufacturers.length <= 0) {
      form.resetFields(['manufacturer']);
    }
  };

  const fetchAutoTypes = async () => {
    try {
      const { data } = await APIRequest.get(
        API_ENDPOINTS.GET_PUBLIC_AUTO_TYPES,
      );
      setAutoTypes(data);
    } catch (error) {
      console.error('Ошибка при получении типов автомобилей:', error);
    }
  };

  const fetchAutoBrands = async (labelType: string) => {
    try {
      const { data } = await APIRequest.get(
        API_ENDPOINTS.GET_PUBLIC_AUTO_BRANDS(labelType),
      );
      setAutoBrands(data);
    } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
    }
  };
  const fetchAutoModel = async (typeId: string, brandId: string) => {
    try {
      const { data } = await APIRequest.get(
        API_ENDPOINTS.GET_PUBLIC_AUTO_MODEL(typeId, brandId),
      );
      setAutoModels(data);
    } catch (error) {
      console.error('Ошибка при получении моделей автомобилей:', error);
    }
  };
  const fetchManufacturers = async () => {
    try {
      const { data } = await APIRequest.get(
        API_ENDPOINTS.GET_PUBLIC_MANUFACTURERS,
      );
      setManufacturers(data);
    } catch (error) {
      console.error('Ошибка при получении моделей автомобилей:', error);
    }
  };

  return {
    autoTypes,
    autoBrands,
    autoModels,
    manufacturers,
    labelType,
    labelBrand,
    initializeForm,
    onFinish,
    handleTypeChange,
    handleBrandChange,
    handleModelChange,
    handleManufactureChange,
    handleClearTagsModel,
    handleClearTagsManufacture,
    handleTagCloseModel,
    handleTagCloseManufacture,
    fetchAutoTypes,
    fetchAutoBrands,
    fetchAutoModel,
    fetchManufacturers,
  };
};
