import { IDataProduct } from '@/interface/addingProduct/product.interface';
import { API_ENDPOINTS } from './api.data';

export const getProduct = async (id: string): Promise<IDataProduct> => {
  const res = await fetch(API_ENDPOINTS.EDIT_PRODUCT(id), {
    method: 'GET',
    headers: new Headers({ 'content-type': 'application/json' }),
    next: { revalidate: 10 },
  });
  return res.json();
};
