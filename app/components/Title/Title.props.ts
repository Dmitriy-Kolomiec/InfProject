import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface TitleProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLTitleElement>,
    HTMLTitleElement
  > {
  tag: 'h1' | 'h2' | 'h3';
  children: ReactNode;
}
