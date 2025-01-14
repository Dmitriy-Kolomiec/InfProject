import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ITabList {
  title: string;
  nameQuery: string;
}

export interface TabListProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  activeTab: string | null;
  tabList: ITabList[];
  productID?: string;
  readonly?: boolean;
}
