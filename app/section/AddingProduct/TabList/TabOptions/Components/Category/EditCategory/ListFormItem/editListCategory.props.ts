import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface IModel {
  id: string;
  name: string;
}

export interface EditListCategoryProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  categories: IModel[];
  subCategories: IModel[];
  category: string;
  subCategory?: string;
  additionalSubCategory?: string;
  handleSubCategoryChange: (value: string) => void;
  handleCategoryChange: (value: string) => void;
  handleAdditionalSubCategoryChange: (value: string) => void;
}
