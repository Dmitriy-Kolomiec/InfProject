import { DetailedHTMLProps, HtmlHTMLAttributes } from 'react';

export interface QuantityCounterProps
  extends DetailedHTMLProps<
    HtmlHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  count: number;
  setCount: (newCount: number) => void;
  disabledUp?: number;
}
