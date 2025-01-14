import { notify } from '@/data/utils.common';
import {
  IBreadCrumb,
  ICategoriesTree,
  IProduct,
  IPublicCategory,
  IPublicProducts,
} from '@/interface/publicPart/publicPart.interface';
import axios from 'axios';
import { API_ENDPOINTS } from '../api.data';

// Get categories

export async function getCategories(): Promise<IPublicCategory[] | null> {
  try {
    const response = await fetch(API_ENDPOINTS.GET_LIST_CATEGORIES, {
      method: 'GET',
      headers: new Headers({ 'content-type': 'application/json' }),
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Ошибка при запросе категорий:', error);
  }
  return null;
}

// Get categories for sidebar

export async function fetchTreeCategories(): Promise<ICategoriesTree[] | null> {
  try {
    const response = await fetch(API_ENDPOINTS.GET_TREE_CATEGORIES, {
      method: 'GET',
      headers: new Headers({ 'content-type': 'application/json' }),
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Ошибка при запросе категорий для sidebar:', error);
  }
  return null;
}

// GET Products list
interface IFetchProductsList {
  aliasCategory: string;
  isOnlyInStock: boolean;
  page: number;
  pageSize: number;
  autoBrand: string;
  autoType: string;
  autoModels: string[];
  manufacturers: string[];
  price: string;
}

export async function fetchProductsList({
  aliasCategory,
  isOnlyInStock,
  page,
  pageSize,
  autoType,
  autoBrand,
  autoModels,
  manufacturers,
  price,
}: IFetchProductsList): Promise<IPublicProducts | null> {
  const bodyRequest = {
    category: aliasCategory,
    autoBrand: autoBrand || null,
    autoType: autoType || null,
    autoModels: autoModels || null,
    manufacturers: manufacturers || null,
    price: price || null,
    isOnlyInStock: isOnlyInStock || false,
    page: page,
    limit: pageSize,
  };
  const jsonString = JSON.stringify(bodyRequest);

  try {
    const response = await fetch(
      API_ENDPOINTS.GET_PRODUCTS_BY_CATEGORY(jsonString),
      {
        cache: 'no-store',
      },
    );
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Ошибка при запросе списка продуктов:', error);
    if (axios.isAxiosError(error) && error.message) {
      notify('error', {
        message: error.message,
      });
    }
  }
  return null;
}

// GET PRODUCT
interface IFetchProduct {
  aliasProductId: number;
  partnumber?: number | null;
}

export async function fetchProduct({
  aliasProductId,
  partnumber,
}: IFetchProduct): Promise<IProduct | null> {
  try {
    const response = await fetch(
      API_ENDPOINTS.GET_PUBLIC_PRODUCT(aliasProductId, partnumber),
      {
        method: 'GET',
        headers: new Headers({ 'content-type': 'application/json' }),
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Ошибка при запросе карточки товара:', error);
  }
  return null;
}

// GET PROPERTIES TREE FOR PRODUCT
export async function fetchPropertiesTree({
  aliasProductId,
}: {
  aliasProductId: number;
}): Promise<any> {
  try {
    const response = await fetch(
      API_ENDPOINTS.GET_PUBLIC_PROPERTIES_TREE(aliasProductId),
      {
        method: 'GET',
        headers: new Headers({ 'content-type': 'application/json' }),
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Ошибка при запросе дерева характеристик:', error);
  }
  return null;
}

// Breadcrumb
export async function fetchBreadcrumb({
  aliasProductId,
}: IFetchProduct): Promise<IBreadCrumb[] | null> {
  try {
    const response = await fetch(
      API_ENDPOINTS.GET_PUBLIC_BREADCRUMB(aliasProductId),
      {
        method: 'GET',
        headers: new Headers({ 'content-type': 'application/json' }),
      },
    );

    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Ошибка при запросе хлебных крошек:', error);
  }
  return null;
}

// Get Info
export async function fetchInfo(): Promise<any | null> {
  try {
    const response = await fetch(API_ENDPOINTS.GET_PUBLIC_INFORMATION, {
      method: 'GET',
      headers: new Headers({ 'content-type': 'application/json' }),
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Ошибка при запросе данных для информации:', error);
  }
  return null;
}
