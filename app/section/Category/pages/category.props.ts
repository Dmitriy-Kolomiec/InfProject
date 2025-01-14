import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface CategoryProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  alias: string;
}
