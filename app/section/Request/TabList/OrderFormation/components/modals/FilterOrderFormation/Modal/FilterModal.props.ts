import { ITags } from '@/interface/addingProduct/addPartNumber.interface';
import { FormInstance } from 'antd';
import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from 'react';

export interface FilterModalProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  form: FormInstance<any>;
  hideModal: Dispatch<SetStateAction<boolean>>;
  setCountFilter: Dispatch<SetStateAction<number>>;
  tagsManufacturers: ITags[];
  setTagsManufacturers: Dispatch<SetStateAction<ITags[]>>;
  tagsSellers: ITags[];
  setTagsSellers: Dispatch<SetStateAction<ITags[]>>;
}
