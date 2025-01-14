import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from 'react';

export interface RequestInfoSuppliersProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setIsOpenModalResTimes: Dispatch<SetStateAction<boolean>>;
  setIsOpenModalReqInfoSuppliers: Dispatch<SetStateAction<boolean>>;
}
