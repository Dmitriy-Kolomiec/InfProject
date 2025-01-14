import { IConnections } from './connections.inteface';
import { ICategories, IProperties, IVehicle } from './options.interface';
import { IPartNumbers } from './partNumbers.interface';

export interface IDataProduct {
  product: IProduct;
  categories?: ICategories[];
  properties?: IProperties[];
  vehicle?: IVehicle[];
  partNumbers?: IPartNumbers[];
  connections?: IConnections[];
  files?: [
    {
      id: number;
      path: string;
    },
  ];
}
export interface IProduct {
  id: string;
  name?: string;
  description?: string;
  additionalNames?: string;
  files?: [
    {
      id: number;
      path: string;
    },
  ];
}

export interface IShouldShow {
  showAddingCategory: boolean;
  showEditCategory: boolean;
  showAddingProperties: boolean;
  showEditProperties: boolean;
  showAddingVehicle: boolean;
  showEditVehicle: boolean;
  showAddingRelations: boolean;
  showEditRelations: boolean;
}

export interface ProductContextData {
  dataProduct: IDataProduct;
  setDataProduct: React.Dispatch<React.SetStateAction<IDataProduct>>;
  shouldShowComponent: IShouldShow;
  setShouldShowComponent: React.Dispatch<React.SetStateAction<IShouldShow>>;
}
