export interface IConnections {
  propertyValue: IPropertyConnection[];
  relatedPropertyValues: IRelatedProperty[];
}

export interface IPropertyConnection {
  relationPropertyValueId: number;
  productId: number;
  productName: string;
  property: string;
  propertyValueId: number;
  type: string;
  unit?: string;
  value: string;
}

export interface IRelatedProperty {
  relatedProduct: { id: number; name: string };
  propertyValue: IPropertyConnection[];
  relation: IRelation;
}
export interface IRelation {
  id: number;
  relationType: string;
  isFully?: boolean;
  description?: string;
}
export interface ITreeCategories {
  name: string;
  key: string;
  children?: ITreeCategories[];
  fillingProgress?: string;
  count?: string;
}
