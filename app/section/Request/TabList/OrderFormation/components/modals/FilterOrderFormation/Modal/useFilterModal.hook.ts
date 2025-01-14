import { FormInstance } from 'antd';
import { Dispatch, SetStateAction, useContext } from 'react';
import { ITags } from '@/interface/addingProduct/addPartNumber.interface';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { RequestContext } from '@/context/Request/request.context';

interface IQueryFilter {
  manufacturers?: (number | undefined)[];
  sellers?: (number | undefined)[];
  price?: string;
  isOnlyInStock?: boolean;
  tab: string | undefined;
}

interface IProps {
  form: FormInstance<any>;
  hideModal: Dispatch<SetStateAction<boolean>>;
  setCountFilter: Dispatch<SetStateAction<number>>;
  tagsSellers: ITags[];
  setTagsSellers: Dispatch<SetStateAction<ITags[]>>;
  tagsManufacturers: ITags[];
  setTagsManufacturers: Dispatch<SetStateAction<ITags[]>>;
}

export const useFilterModal = ({
  form,
  setCountFilter,
  hideModal,
  tagsSellers,
  setTagsSellers,
  tagsManufacturers,
  setTagsManufacturers,
}: IProps) => {
  const { dataRequest } = useContext(RequestContext);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const manufacturers = searchParams.get('manufacturers')?.split('-') || [];
  const isOnlyInStock = searchParams.get('isOnlyInStock') || 'false';
  const sellers = searchParams.get('sellers')?.split('-') || [];
  const priceStart = searchParams.get('price')?.split('-')[0] || undefined;
  const priceEnd = searchParams.get('price')?.split('-')[1] || undefined;
  const dataFilter = dataRequest.filteringItems;

  const initializeForm = async () => {
    form.setFieldsValue({
      isOnlyStock: isOnlyInStock,
      priceStart: priceStart,
      priceEnd: priceEnd,
    });
    if (manufacturers.length > 0) {
      const initialManufacturers = manufacturers
        .map(manufacturerId => {
          const initialManufacturer = dataFilter?.manufacturers.find(
            item => item.id === Number(manufacturerId),
          );
          if (initialManufacturer) {
            return {
              id: initialManufacturer.id,
              label: initialManufacturer.label,
              name: initialManufacturer.name,
            };
          }
          return null;
        })
        .filter(Boolean) as ITags[];

      setTagsManufacturers(initialManufacturers);
    }

    if (sellers.length > 0) {
      const initialSellers = sellers
        .map(sellerId => {
          const initialSeller = dataFilter?.sellers.find(
            item => item.id === Number(sellerId),
          );
          if (initialSeller) {
            return {
              id: initialSeller.id,
              label: initialSeller.name,
              name: initialSeller.name,
            };
          }
          return null;
        })
        .filter(Boolean) as ITags[];
      console.log('initialSellers', initialSellers);
      setTagsSellers(initialSellers);
    }
  };

  const changeFilterQuery = (query: IQueryFilter) => {
    // Подсчет активных фильтров
    const activeFilters = [
      query.isOnlyInStock !== undefined ? query.isOnlyInStock : null,
      query.manufacturers && query.manufacturers.length > 0
        ? query.manufacturers
        : null,
      query.sellers && query.sellers.length > 0 ? query.sellers : null,
      query.price ? query.price : null,
    ].filter(Boolean).length;

    setCountFilter(activeFilters);
    const queryString = new URLSearchParams();

    const queryParamsMap = {
      tab: query.tab,
      isOnlyInStock: query.isOnlyInStock?.toString(),
      manufacturers: query.manufacturers?.join('-'),
      sellers: query.sellers?.join('-'),
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
    const { priceStart, priceEnd, isOnlyStock } = value;
    const query: IQueryFilter = {
      tab: 'formation',
      price:
        priceStart || priceEnd
          ? `${priceStart || 0}-${priceEnd || 999000000}`
          : undefined,
      isOnlyInStock: isOnlyStock === 'true',
      manufacturers: tagsManufacturers?.map(tag => tag.id) || [],
      sellers: tagsSellers?.map(seller => seller.id) || [],
    };

    changeFilterQuery(query);
  };

  // TAGS

  const handleManufactureChange = (_: number, option: any) => {
    if (option) {
      const newTags = option.map((o: any) => ({
        id: o.key,
        name: o.label,
      }));
      setTagsManufacturers(newTags);
    }
  };
  const handleSellersChange = (_: number, option: any) => {
    if (option) {
      const newTags = option.map((o: any) => ({
        id: o.key,
        name: o.label,
      }));
      setTagsSellers(newTags);
    }
  };

  const handleClearTagsManufacture = () => {
    setTagsManufacturers([]);
    form.resetFields(['manufacturer']);
  };
  const handleClearTagsSellers = () => {
    setTagsSellers([]);
    form.resetFields(['sellers']);
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
  const handleTagCloseSellers = (tagToRemove: ITags) => {
    const updatedTags = tagsSellers.filter(tag => tag.id !== tagToRemove.id);
    setTagsSellers(updatedTags);
    if (tagsSellers.length <= 0) {
      form.resetFields(['sellers']);
    }
  };

  return {
    dataFilter,
    handleClearTagsSellers,
    initializeForm,
    onFinish,
    handleManufactureChange,
    handleClearTagsManufacture,
    handleTagCloseManufacture,
    handleSellersChange,
    handleTagCloseSellers,
  };
};
