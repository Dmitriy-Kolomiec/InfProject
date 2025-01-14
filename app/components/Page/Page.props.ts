import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface PageProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  widthLarge?: boolean;
  children: ReactNode;
}
