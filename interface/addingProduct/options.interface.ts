// Categories
export interface ICategories {
  productCategoryId: string;
  categories: ICategory[];
}
export interface ICategory {
  id: string;
  label: string;
  description?: string;
  name: string;
  parentId: string | null;
}

// Characteristic
export interface IProperties {
  property: { id: string; name: string };
  propertyProductId: number;
  unit: IUnit;
  propertyValues: IPropertyValue[];
  defaultValue?: string;
}
export interface IPropertyValue {
  id: number;
  value: string;
  description: string;
  files: string[];
}
export interface IAddProperties {
  propertyId: number;
  propertyValues?: [
    {
      propertyValuesId: number;
      value: string;
      description: string;
      fileIds: string[];
    },
  ];
}
export interface IProperty {
  id: string;
  property: string;
  unit: string;
}
export interface IUnit {
  id: string;
  name: string;
}

// Vehicles
export interface IVehicle {
  vehicleProductId?: string;
  autoType: IAutoTypes;
  autoBrand: IAutoTypes;
  autoModels: IAutoModel[];
}
export interface IAutoTypes {
  id: number;
  name: string;
  label: string;
  description?: string;
}
export interface IAutoModel {
  externalScheme?: string;
  identifyMethod?: string;
  amount?: number;
  autoBrandId: number;
  autoTypeId: number;
  description: string;
  id: number;
  label: string;
  name: string;
}
export interface IAddModel {
  name: string;
  label: string;
  description?: string;
}
