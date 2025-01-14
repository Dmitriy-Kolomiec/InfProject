import { ITags } from '@/interface/addingProduct/addPartNumber.interface';
import { FormInstance } from 'antd';
import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from 'react';

export interface FilterTopModalProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  form: FormInstance<any>;
  hideModal: Dispatch<SetStateAction<boolean>>;
  setCountFilter: Dispatch<SetStateAction<number>>;
  tagsModel: ITags[];
  setTagsModel: Dispatch<SetStateAction<ITags[]>>;
  tagsManufacturers: ITags[];
  setTagsManufacturers: Dispatch<SetStateAction<ITags[]>>;
  isOrderFormation?: boolean;
}
