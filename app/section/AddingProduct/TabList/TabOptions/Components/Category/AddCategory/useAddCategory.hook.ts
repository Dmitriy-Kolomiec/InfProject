import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { API_ENDPOINTS } from '@/data/api/api.data';
import APIRequest from '@/data/api/api.utils';
import { notify } from '@/data/utils.common';
import { Form } from 'antd';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

export interface ICategory {
  id: string;
  name: string;
  label: string;
  parentId: string | null;
  description?: string;
}
export interface ICategoriesDic {
  [key: string]: ICategory[] | undefined;
}

export const useCategories = () => {
  const [newCatetory, setNewCategory] = useState<number>();
  const [newSubCatetory, setSubNewCategory] = useState<number>();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [lastCategoryId, setLastCategoryId] = useState<string | null>(null);
  const [categoriesDic, setCategoriesDic] = useState<ICategoriesDic>({});
  const { setShouldShowComponent, setDataProduct, dataProduct } =
    useContext(ProductContext);
  const [form] = Form.useForm();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isOpenModalCreateCategory, setIsOpenModalCreateCategory] =
    useState<boolean>(false);
  const [isOpenModalCreateSubCategory, setIsOpenModalCreateSubCategory] =
    useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const updateCategoriesDic = (id: string, data: any) => {
    setCategoriesDic(state => ({
      ...state,
      [id]: data,
    }));
  };

  const fetchCategories = async () => {
    const res = await APIRequest.get(API_ENDPOINTS.GET_CATEGORIES(null));
    setCategories(res.data);
  };

  const fetchSubCategory = async (category: string) => {
    const res = await APIRequest.get(API_ENDPOINTS.GET_CATEGORIES(category));
    updateCategoriesDic(category, res.data);
  };

  useEffect(() => {
    fetchCategories();
    if (category) {
      fetchSubCategory(category);
    }
  }, [category]);

  useEffect(() => {
    if (newCatetory) {
      form.setFieldsValue({
        category: newCatetory,
      });
      setSelectedOptions([String(newCatetory)]);
      handleCategoryChange(String(newCatetory));
    }
  }, [newCatetory]);

  const handleCategoryChange = (value: string) => {
    if (value !== 'none') {
      setCategory(value);
    }
  };
  const handleSubCategoryChange = (value: string) => {
    if (value !== 'none') {
      setCategory(value);
    }
  };

  const hideAddingCategory = () => {
    setShouldShowComponent(state => ({
      ...state,
      showAddingCategory: false,
    }));
    form.resetFields();
  };

  const handleSubmitAddCategory = async (value: any) => {
    setIsLoader(true);
    for (const key in value) {
      if (value[key] !== undefined) {
        setLastCategoryId(value[key]);
      }
    }
    // newSubCatetory использую в том случае, если создаются новые подкатегории, которые идут в initialValue.
    // lastCategoryId в том случае, есть подкатегории
    // value.category если создаем только первую категорию
    try {
      const response = await APIRequest.post<any>(
        API_ENDPOINTS.ADD_CATEGORIES_PRODUCT,
        {
          productId: dataProduct.product.id,
          categoryId: newSubCatetory || lastCategoryId || value.category,
        },
      );
      setDataProduct(prevState => ({
        ...prevState,
        categories: [...(prevState.categories || []), response.data],
      }));
      setIsLoader(false);
      hideAddingCategory();
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error) && error.message) {
        notify('error', {
          message: error.message,
        });
      }
      setIsLoader(false);
    }
  };

  return {
    categories,
    category,
    handleSubCategoryChange,
    handleCategoryChange,
    fetchCategories,
    fetchSubCategory,
    categoriesDic,
    hideAddingCategory,
    handleSubmitAddCategory,
    form,
    setLastCategoryId,
    isDisabled,
    setIsDisabled,
    isOpenModalCreateCategory,
    setIsOpenModalCreateCategory,
    selectedOptions,
    setSelectedOptions,
    isOpenModalCreateSubCategory,
    setIsOpenModalCreateSubCategory,
    setNewCategory,
    newSubCatetory,
    setSubNewCategory,
    setCategory,
    isLoader,
  };
};
