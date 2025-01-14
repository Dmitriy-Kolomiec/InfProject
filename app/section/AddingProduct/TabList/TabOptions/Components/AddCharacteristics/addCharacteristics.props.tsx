import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface AddCharacteristicsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  closeDrawer?: () => void;
}
