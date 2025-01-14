import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface InfoAboutCompanyProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  name: string;
  rating: number;
  numComments: number;
  width?: 'small' | 'medium' | 'large';
  qualityMark?: boolean;
}
