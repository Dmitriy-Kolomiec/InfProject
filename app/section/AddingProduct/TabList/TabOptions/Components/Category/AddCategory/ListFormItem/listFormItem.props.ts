import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from 'react';
import { ICategoriesDic } from '../useAddCategory.hook';
import { ICategory } from '@/interface/addingProduct/options.interface';
import { FormInstance } from 'antd';

export interface ListFormItemProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setCategory?: Dispatch<SetStateAction<string | null>>;
  form: FormInstance<any>;
  categories: ICategory[];
  handleSubCategoryChange?: (value: string) => void;
  handleCategoryChange: (value: string) => void;
  openModalCreateCategory: Dispatch<SetStateAction<boolean>>;
  openModalCreateSubCategory: Dispatch<SetStateAction<boolean>>;
  setLastCategoryId: Dispatch<SetStateAction<string | null>>;
  categoriesDic: ICategoriesDic;
  selectedOptions: string[];
  setSelectedOptions: Dispatch<SetStateAction<string[]>>;
  newSubCategory?: number | undefined;
}
