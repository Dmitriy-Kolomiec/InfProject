import { IProductList } from '@/interface/request/request.interface';
import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from 'react';

export interface DeletePositionsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setDeletionModalPositions: Dispatch<SetStateAction<boolean>>;
  setSelectedRowKeys: Dispatch<SetStateAction<IProductList[]>>;
  selectedRowKeys: IProductList[];
}
