import { Form, RadioChangeEvent } from 'antd';
import { useCallback, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { APP_PATHS } from '@/data/paths.data';
import { ITags } from '@/interface/addingProduct/addPartNumber.interface';

interface IProps {
  labelCategory: string;
}

export const useTopFilterPublic = ({ labelCategory }: IProps) => {
  const [tagsModel, setTagsModel] = useState<ITags[]>([]);
  const [tagsManufacturers, setTagsManufacturers] = useState<ITags[]>([]);
  const [form] = Form.useForm();
  const [countFilter, setCountFilter] = useState<number>(0);
  const [isOpenModalFilter, setIsOpenModalFilter] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const displayLayout: string | null = searchParams.get('layout');
  const autoTypeQuery: string | null = searchParams.get('autoType');
  const autoBrandQuery: string | null = searchParams.get('autoBrand');
  const autoModelQuery: string | null = searchParams.get('autoModels');
  const priceQuery: string | null = searchParams.get('price');
  const isOnlyInStockQuery: string | null = searchParams.get('isOnlyInStock');
  const manufacturersQuery: string | null = searchParams.get('manufacturers');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
  const clearFilterQuery = (label: string) => {
    if (label) {
      router.push(APP_PATHS.PUBLIC_CATALOG(label));
      setCountFilter(0);
      form.resetFields();
      setTagsModel([]);
      setTagsManufacturers([]);
    }
  };

  const onChangeRadio = (e: RadioChangeEvent) => {
    const value = e.target.value;
    if (value === 'false') {
      router.replace(
        pathname + '?' + createQueryString('isOnlyInStock', 'false'),
      );
    }
    if (value === 'true') {
      router.replace(
        pathname + '?' + createQueryString('isOnlyInStock', 'true'),
      );
    }
  };

  const onDisplayTable = () => {
    router.replace(
      APP_PATHS.PUBLIC_CATALOG(labelCategory) +
        '?' +
        createQueryString('layout', 'table'),
    );
  };
  const onDisplayList = () => {
    router.replace(
      APP_PATHS.PUBLIC_CATALOG(labelCategory) +
        '?' +
        createQueryString('layout', 'card'),
    );
  };

  // Функция для подсчёта активных фильтров
  const calculateActiveFilters = () => {
    const activeFilters = [
      autoTypeQuery,
      autoBrandQuery,
      autoModelQuery,
      priceQuery,
      isOnlyInStockQuery,
      manufacturersQuery,
    ].filter(Boolean).length;

    setCountFilter(activeFilters);
  };
  return {
    tagsModel,
    tagsManufacturers,
    form,
    countFilter,
    setCountFilter,
    isOpenModalFilter,
    setIsOpenModalFilter,
    displayLayout,
    autoTypeQuery,
    autoBrandQuery,
    autoModelQuery,
    isOnlyInStockQuery,
    clearFilterQuery,
    onChangeRadio,
    onDisplayTable,
    onDisplayList,
    calculateActiveFilters,
    setTagsModel,
    setTagsManufacturers,
  };
};
