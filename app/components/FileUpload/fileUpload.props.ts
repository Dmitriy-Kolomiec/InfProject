import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from 'react';

export interface UploadFileProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title?: string;
  setFileIds?:
    | Dispatch<SetStateAction<number[]>>
    | Dispatch<SetStateAction<{ [key: number]: number[] }>>;
  setFileIdsDescription?: Dispatch<SetStateAction<number[]>>;
  initialData?: [
    {
      id: number;
      path: string;
    },
  ];
  urlPath: string;
  valueIndex?: number;
}
