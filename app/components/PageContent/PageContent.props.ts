import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface PageContentProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isCenter?: boolean;
  children: ReactNode;
}
