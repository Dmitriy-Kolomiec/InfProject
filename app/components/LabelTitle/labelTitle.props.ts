import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface LabelTitleProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  text: string;
}
