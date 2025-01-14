import { IDataProduct } from '@/interface/addingProduct/product.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface EditProductProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  dataProduct?: IDataProduct;
}
