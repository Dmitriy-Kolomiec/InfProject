import {
  INotPropertiesTree,
  IPublicFileProperty,
} from '@/interface/publicPart/publicPart.interface';

export type PropertiesTree = IPropertiesTreeNode[] | INotPropertiesTree;

export interface IPropertiesTreeNode {
  isValue?: boolean;
  isPartNumber?: boolean;
  key: number;
  id: number;
  title: string;
  children?: IPropertiesTreeNode[];
  files?: IPublicFileProperty[];
  isSelected: boolean;
}

export interface IPropertyCategory {
  id: number;
  key: number;
  parentKey?: number;
  title: string;
  children: IPropertyChild[];
  isSelected?: boolean;
}

export interface IPropertyChild {
  isSelected?: boolean;
  isDisabled?: boolean;
  id: number;
  key?: number;
  parentKey?: number;
  title: string | number;
  isPartNumber?: boolean;
}

export interface IAboutProperty {
  id: number;
  name: string;
  unit: {
    id: number;
    name: string;
  };
  values: [
    {
      id: number;
      value: string;
      description: string;
      isSelected?: boolean;
      isActive?: boolean;
      isDisabled?: boolean;
    },
  ];
}

export interface IPublicPartNumberTree {
  parentKey: number;
  childKey?: number;
  id: number;
  title: string;
}

export interface IAvailableProduct {
  manufacturer: string;
  partnumber: string;
  price: number;
  amount: number;
  vat: number;
  warehouse: string;
  seller: string;
  relevance: string;
}
