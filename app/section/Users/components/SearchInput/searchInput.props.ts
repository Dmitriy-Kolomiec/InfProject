import { IUser } from '@/interface/user/user.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface SearchInputProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  users?: IUser[];
}
