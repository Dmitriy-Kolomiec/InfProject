import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface NotificationsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  // setHideInfo?: Dispatch<SetStateAction<boolean>>;
  // setOpenModal?: Dispatch<SetStateAction<boolean>>;
  // setDownloadType?: Dispatch<SetStateAction<string>>;
  setHideInfo?: any;
  setOpenModal?: any;
  setDownloadType?: any;
}
