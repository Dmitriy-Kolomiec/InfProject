import { IAutoTypes, IProperties, IPropertyValue } from './options.interface';

export interface IManufacters {
  manufacturerPartNumberId: number;
  experience: IExperience;
  manufacturer: IManufacturer;
}
export interface IManufacturer {
  id: number;
  name: string;
}

export interface IExperience {
  id: number;
  rating: number;
  review: string;
}
export interface IPartNumber {
  id: number;
  partNumber: string;
  isFilled: boolean;
}

export interface IPartNumbers {
  manufacturer: IManufacters[];
  experience: IExperience[];
  partNumber: IPartNumber;
  propertyValues: IPropertyValue[];
  vehicle: IVehiclePartNumber[];
  files: [{ id: number; path: string }];
}

export interface IVehiclePartNumber {
  vehicleProductId?: number;
  autoType: IAutoTypes;
  autoBrand: IAutoTypes;
  autoModel: IModelPartNumber;
}

interface IModelPartNumber {
  id: string;
  name: string;
  label?: string;
  amount?: number;
  identifyMethod?: string;
  externalScheme?: string;
}
export interface IInitialValuePartNumber {
  partNumber: string;
  autoModelsIds: IModelPartNumber;
  manufacturers: {
    manufacturerId: number | undefined;
    rating: string;
    review: string;
  }[];
}
export interface ICharacteristic {
  name: string;
  id: number;
  values: string[];
}

export interface ITableData {
  partNumberId: string;
  fillingProgress: string;
  partnumber: string;
  properties: IProperties[];
  defaultValuesSelect: { [key: string]: string[] }[];
  combinationId?: string;
  key: number;
}
export interface IDataTablePartNumbers {
  partNumberId: string;
  fillingProgress: string;
  partnumber: string;
  properties: IProperties[];
  defaultValuesSelect: { [key: string]: string[] }[];
}
// Not partNumber
// export interface IPropertyValuesComb {

// propertyValues: [{

//   id: number;
//   propertyProductId: number;
//   value: string;
//   description?: string;
// }]
// }
interface PropertyValue {
  propertyValueId: number;
  propertyProductId: number;
  value: string;
}

export interface IPropertyValuesComb {
  amount?: number;
  data: [
    {
      combinationId: string;
      propertyValues: PropertyValue[];
    },
  ];
}

export interface IDataTableNotPartNumbers {
  fillingProgress: string;
  partnumber?: string;
  properties: IProperties[];
  combinationId?: string;
  // defaultValuesSelect: { [key: string]: string };
}

export interface INotExist {
  data: [
    {
      notExistId: string;
      notExistPropertyValues: PropertyValue[];
    },
  ];
}

export interface ITreeItem {
  isValue?: boolean;
  title: string;
  key: string;
  children?: ITreeItem[];
  fillingProgress?: string;
}
