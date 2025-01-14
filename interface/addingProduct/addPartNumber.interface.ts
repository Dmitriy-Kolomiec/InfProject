export interface IAddPartNumber {
  partNumber: string;
  autoModelsIds: IVehicles[];
  manufacturers: IAddManufacturers[];
}
interface IVehicles {
  amount?: number;
  vehicleId: number;
  identifyMethod?: string;
  externalScheme?: string;
}
export interface IAddManufacturers {
  manufacturerId: number;
  rating: string;
  review: string;
}
export interface IAddManufacturer {
  id: number;
  name: string;
  label: string;
  description: string;
}
export interface ITags {
  id?: number;
  name: string;
  label?: string;
}
