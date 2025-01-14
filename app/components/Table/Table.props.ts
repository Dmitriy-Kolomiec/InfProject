import React, {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactElement,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  RefObject,
} from 'react';

export interface ITableProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  > {
  cols: ITableCol[];
  rows: ITableRow[];
  title?: string;
  className?: string;
  rowsLoading?: boolean;
  style?: CSSProperties;
  hideHead?: boolean;
}

export interface ITableCol {
  content:
    | React.ReactElement
    | string
    | number
    | Array<ReactElement | string | number>;
  childrens?: Array<ReactElement | string | number>;
  width?: string | number;
  noBg?: boolean;
  style?: CSSProperties;
  noBorder?: boolean;
  highlightBorder?: boolean;
  className?: string;
  isLink?: boolean;
  href?: string;
  hrefTarget?: '_self' | '_blank';
  fontSize?: 'default' | 'large';
  noWrapper?: boolean;
  hasFilter?: boolean;
  filterDirection?: 'up' | 'down';
  onFilterChange?: () => void;
  onClick?: (e: ReactMouseEvent<Element, MouseEvent>) => void;
}

export interface ITableRow {
  cols: ITableCol[];
  notificationsNumber?: number;
  className?: string;
  noBg?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
  childContent?: ReactNode;
  onClick?: (e: any) => void;
  onDoubleClick?: (e: any) => void;
  onMouseEnter?: (e: any) => void;
  onMouseLeave?: (e: any) => void;
  ref?: RefObject<any>;
}
