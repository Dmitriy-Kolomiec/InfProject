import { useEffect, useState } from 'react';
import { Form } from 'antd';
import { Key } from 'antd/es/table/interface';
import { ITags } from '@/interface/addingProduct/addPartNumber.interface';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IFilter } from '@/interface/categories/categories.interface';
import { APP_PATHS } from '@/data/paths.data';
import { ITreeCategories } from '@/interface/addingProduct/connections.inteface';

interface IQueryFilter {
  autoType?: number;
  autoBrand?: number;
  autoModels?: (number | undefined)[];
}

export const useCategories = () => {
  const [countFilter, setCountFilter] = useState<number>();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const autoTypeQuery: string | null = searchParams.get('autoType');
  const autoBrandQuery: string | null = searchParams.get('autoBrand');
  const autoModelQuery: string | null = searchParams.get('autoModels');

  // Функция для подсчёта активных фильтров
  const calculateActiveFilters = () => {
    let count = 0;
    if (autoTypeQuery !== null) count += 1;
    if (autoBrandQuery !== null) count += 1;
    if (autoModelQuery !== null) count += 1;
    setCountFilter(count);
  };

  useEffect(() => {
    calculateActiveFilters();
  }, [autoTypeQuery, autoBrandQuery, autoModelQuery]);

  // TREE
  const [treeData, setTreeData] = useState<ITreeCategories[]>();
  const [expandedKeysTree, setExpandedKeysTree] = useState<Key[]>([]);

  const expandAll = () => {
    const keys = getAllKeys(treeData!);
    setExpandedKeysTree(keys);
  };

  const collapseAll = () => {
    setExpandedKeysTree([]);
  };
  const getAllKeys = (data: ITreeCategories[]): string[] => {
    let keys: string[] = [];
    data?.forEach(item => {
      keys.push(item.key);
      if (item.children) {
        keys = keys.concat(getAllKeys(item.children));
      }
    });
    return keys;
  };
  // Drawer
  const [formFilter] = Form.useForm();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [tagsDraver, setTagsDraver] = useState<ITags[]>([]);
  const [isDisabledFormFilter, setIsDisabledFormFilter] =
    useState<boolean>(true);

  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };
  const onOpenDrawer = () => {
    setOpenDrawer(true);
  };

  const applyFilter = () => {
    formFilter.submit();
    onCloseDrawer();
  };

  const clearFilterQuery = () => {
    router.push(APP_PATHS.CATEGORIES);
    setTagsDraver([]);
    formFilter.resetFields();
  };
  const changeFilterQuery = (query: IQueryFilter) => {
    const queryString = new URLSearchParams();

    if (query.autoType) {
      queryString.set('autoType', `${query.autoType}`);
    }
    if (query.autoBrand) {
      queryString.set('autoBrand', `${query.autoBrand}`);
    }
    if (tagsDraver.length) {
      queryString.set('autoModels', `${tagsDraver.map(tag => tag.id)}`);
    }

    router.push(`${pathname}?${queryString.toString()}`);
  };

  const onSubmitFilter = (value: IFilter) => {
    const query: IQueryFilter = {};

    if (value.autoType) {
      query.autoType = value.autoType;
    }
    if (value.autoBrand) {
      query.autoBrand = value.autoBrand;
    }
    if (tagsDraver) {
      query.autoModels = tagsDraver.map(tag => tag.id);
    }
    changeFilterQuery(query);
  };
  return {
    countFilter,
    treeData,
    setTreeData,
    expandedKeysTree,
    setExpandedKeysTree,
    expandAll,
    collapseAll,
    formFilter,
    openDrawer,
    tagsDraver,
    setTagsDraver,
    isDisabledFormFilter,
    setIsDisabledFormFilter,
    onCloseDrawer,
    onOpenDrawer,
    applyFilter,
    clearFilterQuery,
    onSubmitFilter,
  };
};
