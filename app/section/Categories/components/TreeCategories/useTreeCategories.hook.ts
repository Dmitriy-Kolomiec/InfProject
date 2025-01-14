import { useRouter, useSearchParams } from 'next/navigation';
import { Key } from 'antd/es/table/interface';
import { useState } from 'react';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { Form, TreeProps } from 'antd';

import { DataNode } from 'antd/es/tree';
import { APP_PATHS } from '@/data/paths.data';

export const encodedString = ({
  autoBrandQuery,
  autoTypeQuery,
  autoModelsIds,
}: {
  autoBrandQuery: string | null;
  autoTypeQuery: string | null;
  autoModelsIds?: number[];
}) => {
  const params = {
    parameters: {
      autoBrandId: Number(autoBrandQuery),
      autoTypeId: Number(autoTypeQuery),
      autoModelsIds: autoModelsIds,
    },
  };
  // Преобразование объекта в JSON-строку
  const jsonString = JSON.stringify(params);
  // Кодирование JSON-строки для использования в URL
  const encodedString = encodeURIComponent(jsonString);

  return encodedString;
};

interface IProps {
  expandedKeys: Key[];
  setExpandedKeys: any;
  setTreeData: any;
}
export interface ITreeRow {
  name: string;
  id: number;
  parentId?: number;
  label?: string;
  description?: string;
  subCategories?: number;
  count: number;
}

export const useTreeCategories = ({
  expandedKeys,
  setExpandedKeys,
  setTreeData,
}: IProps) => {
  const [formAddCategory] = Form.useForm();
  const [formEditCategory] = Form.useForm();
  const [formSubCategory] = Form.useForm();
  const searchParams = useSearchParams();
  const router = useRouter();
  const autoTypeQuery: string | null = searchParams.get('autoType');
  const autoBrandQuery: string | null = searchParams.get('autoBrand');
  const autoModelQuery: string | null = searchParams.get('autoModels');
  const [isOpenDrawerAddCategory, setIsOpenDrawerAddCategory] =
    useState<boolean>(false);
  const [isOpenDrawerAddSubCategory, setIsOpenDrawerAddSubCategory] =
    useState<boolean>(false);
  const [isOpenDrawerEditCategory, setIsOpenDrawerEditCategory] =
    useState<boolean>(false);
  const [isDisabledFormCreateCategory, setIsDisabledFormCreateCategory] =
    useState<boolean>(true);
  const [isOpenModalDeleting, setIsOpenModalDeleting] =
    useState<boolean>(false);
  const [selectTreeNode, setSelectTreeNode] = useState<ITreeRow>();
  const autoModelsIds = autoModelQuery?.split(',').map(Number);

  const paramsFilter = encodedString({
    autoBrandQuery,
    autoTypeQuery,
    autoModelsIds,
  });

  const fetchDataTree = async (params: string) => {
    try {
      const response = await APIRequest.get(
        API_ENDPOINTS.GET_CATEGORIES_TREE(params),
      );
      setTreeData(response.data.tree);
    } catch (error) {
      console.error('Ошибка при запросе дерева категорий:', error);
    }
  };

  const onCloseDrawer = () => {
    setIsOpenDrawerAddCategory(false);
    setIsOpenDrawerEditCategory(false);
    setIsOpenDrawerAddSubCategory(false);
  };
  const openAddingCategory = () => {
    setIsOpenDrawerAddCategory(true);
  };
  const openAddingSubCategory = () => {
    setIsOpenDrawerAddSubCategory(true);
  };
  const onSubmitCreateCategory = (value: any) => {
    formAddCategory.submit();
  };

  const onFinishSubmitCategory = async (value: any, parentId?: number) => {
    const { name, label, description } = value;
    const requestBody = {
      name,
      label,
      description,
      parentId: selectTreeNode?.id,
    };
    try {
      await APIRequest.post<any>(API_ENDPOINTS.ADD_CATEGORY, requestBody);
      formAddCategory.resetFields();
      formSubCategory.resetFields();
      fetchDataTree(paramsFilter);
      onCloseDrawer();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onSubmitCreateSubCategory = () => {
    formSubCategory.submit();
  };

  const onSubmitEditCategory = () => {
    formEditCategory.submit();
  };
  const openEditingSubCategory = () => {
    setIsOpenDrawerEditCategory(true);
  };
  const onFinishSubmitEditCategory = async (value: any, parentId?: number) => {
    const { name, label, description } = value;
    const requestBody = {
      id: selectTreeNode?.id,
      parentId: selectTreeNode?.parentId,
      label,
      name,
      description,
    };
    try {
      await APIRequest.put(API_ENDPOINTS.EDIT_CATEGORY, requestBody);
      formEditCategory.resetFields();
      fetchDataTree(paramsFilter);
      onCloseDrawer();
    } catch (error) {
      console.error('Ошибка при редактировании категории:', error);
    }
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeys: any, info: any) => {
    setSelectTreeNode(() => ({
      name: info.node.name,
      id: info.node.key,
      parentId: info.node.parentId,
      label: info.node.label,
      description: info.node.description,
      subCategories: info.node.children?.length,
      count: info.node.count,
    }));
  };

  const openCategory = (node: DataNode) => {
    const nodeKey = node.key;
    if (expandedKeys.includes(nodeKey)) {
      // Если открыт, то закрываем его
      setExpandedKeys((prevKeys: Key[]) =>
        prevKeys.filter(key => key !== nodeKey),
      );
    } else {
      // Если закрыт, то открываем его и его дочерние узлы
      const keysToExpand = expandNodeAndChildren(node);
      setExpandedKeys((prevKeys: Key[]) =>
        Array.from(new Set([...prevKeys, ...keysToExpand])),
      );
    }
  };

  const expandNodeAndChildren = (node: DataNode): Key[] => {
    let keys: Key[] = [node.key];
    if (node.children) {
      node.children.forEach(child => {
        keys = keys.concat(expandNodeAndChildren(child));
      });
    }
    return keys;
  };

  const isNodeExpanded = (nodeKey: Key): boolean => {
    return expandedKeys.includes(nodeKey);
  };

  const toCategory = (id: string) => {
    router.push(APP_PATHS.CATEGORY(id));
  };

  return {
    formAddCategory,
    formEditCategory,
    formSubCategory,
    autoTypeQuery,
    autoBrandQuery,
    autoModelQuery,
    isOpenDrawerAddCategory,
    isOpenDrawerAddSubCategory,
    isOpenDrawerEditCategory,
    isDisabledFormCreateCategory,
    setIsDisabledFormCreateCategory,
    isOpenModalDeleting,
    setIsOpenModalDeleting,
    selectTreeNode,
    paramsFilter,
    fetchDataTree,
    onCloseDrawer,
    openAddingCategory,
    openAddingSubCategory,
    onSubmitCreateCategory,
    onFinishSubmitCategory,
    onSubmitCreateSubCategory,
    onSubmitEditCategory,
    openEditingSubCategory,
    onFinishSubmitEditCategory,
    onSelect,
    openCategory,
    isNodeExpanded,
    toCategory,
  };
};
