import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from 'react';

export interface ButtonsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  deleteModal: Dispatch<SetStateAction<boolean>>;
  addSubCategory: () => void;
  openCategory: () => void;
  editCategory: () => void;
  toCategory: (id: string) => void;
  idCategory: string;
  isOpen?: boolean;
}
