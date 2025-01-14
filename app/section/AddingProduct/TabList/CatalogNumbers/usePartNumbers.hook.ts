import { useCallback, useContext, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Key } from 'antd/es/table/interface';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import {
  IPropertyValuesComb,
  ITreeItem,
} from '@/interface/addingProduct/partNumbers.interface';
import { IDataProduct } from '@/interface/addingProduct/product.interface';
import axios from 'axios';
import { notify } from '@/data/utils.common';

export const usePartNumbers = () => {
  const [expandedKeysTree, setExpandedKeysTree] = useState<Key[]>([]);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [countNotPartNumber, setCountNotPartNumber] = useState<number>(0);
  const [fullnessRate, setFullnessRate] = useState<number>(0);
  const [dataNotPartNumber, setDataNotPartNumber] =
    useState<IPropertyValuesComb>();
  const [treeData, setTreeData] = useState<ITreeItem[]>();
  const searchParams = useSearchParams();
  const displayLayout: string | null = searchParams.get('layout');
  const displayNotExist: string | null = searchParams.get('notExist');
  const displayNotPartNumbers: string | null = searchParams.get(
    'displayNotPartNumbers',
  );
  const productId: string | null = searchParams.get('productId');
  const page: string | null = searchParams.get('page');
  const pageSize = 100;
  const { dataProduct, setDataProduct } = useContext(ProductContext);
  const pathname = usePathname();
  const router = useRouter();
  const [isLoaderNotPartNumber, setIsLoaderNotPartNumber] =
    useState<boolean>(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const filterNotPartNumbers = () => {
    router.push(
      pathname + '?' + createQueryString('displayNotPartNumbers', 'true'),
    );
  };

  const filterByPartNumbers = () => {
    router.push(
      pathname + '?' + createQueryString('displayNotPartNumbers', 'false'),
    );
  };
  const fetchFulnesRate = async () => {
    try {
      const response = await APIRequest.get(
        API_ENDPOINTS.GET_FULLNES_RATE(dataProduct.product.id),
      );

      setFullnessRate(response.data.fullnessRate);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };
  const fetchNotPartNumber = async () => {
    setIsLoaderNotPartNumber(true);
    try {
      const { data } = await APIRequest.get(
        API_ENDPOINTS.GET_PROPERTI_VALUES_COMB(
          dataProduct.product.id,
          page,
          pageSize,
        ),
      );
      setDataNotPartNumber(data);
      setIsLoaderNotPartNumber(false);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const dataProductUpdate = async () => {
    const fetchDataProduct = async () => {
      try {
        const res = await APIRequest.get<IDataProduct>(
          API_ENDPOINTS.EDIT_PRODUCT(productId as string),
        );
        const data = res.data;

        const updatedCategories = data.categories?.map((category: any) => ({
          productCategoryId: category.productCategoryId,
          categories: category.categories.map((subCategory: any) => ({
            id: subCategory.id,
            label: subCategory.label,
            name: subCategory.name,
            parentId: subCategory.parentId,
          })),
        }));

        console.log('Обновление продукта в partNumber: ', data);

        setDataProduct(state => ({
          ...state,
          product: {
            id: data.product.id,
            name: data.product.name,
            additionalNames: data.product.additionalNames,
            description: data.product.description,
            files: data.product.files,
          },
          categories: updatedCategories,
          properties: data.properties,
          vehicle: data.vehicle,
          partNumbers: data.partNumbers,
        }));
      } catch (error) {
        console.log('Ошибка:', error);
        if (axios.isAxiosError(error) && error.message) {
          notify('error', {
            message: error.message,
          });
        }
      }
    };
    fetchDataProduct();
    fetchFulnesRate();
    fetchNotPartNumber();
  };

  // Drawer
  const showDrawerAddCharacteristic = () => {
    setOpenDrawer(true);
  };
  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

  // TREE

  const expandAll = () => {
    const keys = getAllKeys(treeData!);
    setExpandedKeysTree(keys);
  };

  const collapseAll = () => {
    setExpandedKeysTree([]);
  };
  // NOT EXIST
  const onChangeSwitch = (checked: boolean) => {
    if (checked) {
      isShowNotExist();
    } else {
      hiddenNotExist();
    }
  };

  const isShowNotExist = () => {
    router.push(pathname + '?' + createQueryString('notExist', 'true'));
  };

  const hiddenNotExist = () => {
    router.push(pathname + '?' + createQueryString('notExist', 'false'));
  };

  const getAllKeys = (data: ITreeItem[]): string[] => {
    let keys: string[] = [];
    data.forEach(item => {
      keys.push(item.key);
      if (item.children) {
        keys = keys.concat(getAllKeys(item.children));
      }
    });
    return keys;
  };

  return {
    expandedKeysTree,
    setExpandedKeysTree,
    openDrawer,
    countNotPartNumber,
    setCountNotPartNumber,
    fullnessRate,
    dataNotPartNumber,
    setDataNotPartNumber,
    treeData,
    setTreeData,
    displayLayout,
    displayNotExist,
    displayNotPartNumbers,
    dataProduct,
    filterNotPartNumbers,
    filterByPartNumbers,
    fetchFulnesRate,
    fetchNotPartNumber,
    dataProductUpdate,
    showDrawerAddCharacteristic,
    onCloseDrawer,
    expandAll,
    collapseAll,
    onChangeSwitch,
    page,
    isLoaderNotPartNumber,
  };
};
