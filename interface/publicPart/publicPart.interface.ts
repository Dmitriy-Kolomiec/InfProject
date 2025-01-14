export interface IPublicCategory {
  count: number;
  id: number;
  label: string;
  name: string;
  parentId: number;
  subCategories: IPublicCategory[];
}
export interface ICategoriesTree {
  value: string;
  label: string;
  parentId: number;
  id: number;
  count: string;
  children?: ICategoriesTree[];
}

export interface IBreadCrumb {
  id: number;
  label: string;
  name: string;
  parentId: number;
  description: string;
}
// Products list
export interface IPublicProduct {
  description: string;
  id: number;
  name: string;
  data: [
    {
      manufacturer: { id: number; name: string };
      partNumber: { id: number; value: string };
      stockBalance: { id: number; price: number; vat: number };
      warehouse: { id: number; name: string; amount: number };
    },
  ];
  picture: { id: number; path: string };
}

export interface IPublicProducts {
  category: {
    id: number;
    name: string;
    label: string;
  };
  amount: number;
  productAmount: number;
  categoryTree: IBreadCrumb[];
  products: IPublicProduct[];
}

// Product
export interface IProduct {
  files: IPublicFiles[];
  product: {
    id: number;
    name: string;
    description: string | null;
    additionalNames: string | null;
  };
  properties: IPublicProperty[];
  items: IPublicPartNumbers;
}
export interface IPublicProperty {
  property: {
    id: number;
    name: string;
    unit: {
      id: number;
      name: string;
    };
    values: [
      {
        id: number;
        value: string;
        description: string;
        isSelected?: boolean;
        isActive?: boolean;
        isDisabled?: boolean;
      },
    ];
  };
}
export interface IPublicPartNumbers {
  autoModels: IPublicAutoModels[];
  partNumbers: IPublicPartNumber[];
}

export interface IPublicAutoModels {
  autoModel: {
    id: number;
    label: string;
    name: string;
    description: string;
    externalScheme: string;
  };
  autoBrand: {
    id: number;
    label: string;
    name: string;
    description: string;
  };
  autoType: {
    id: number;
    label: string;
    name: string;
    description: string;
  };
}
export interface IPublicPartNumber {
  manufacturer: { id: number; name: string; label: string };
  partNumber: {
    id: number;
    value: string;
  };
  price: { stockBalanceId: string; price: number; vat: number };
  warehouse: { id: string; name: string; amount: number };
}

export interface IPublicFiles {
  fileId: number;
  path: string;
}

export interface IPublicPartNumber {
  id: number;
  title: string;
}

export interface INotPropertiesTree {
  files: IPublicFileProperty[];
  partNumbers: IPublicPartNumber[];
}

export interface IPublicFileProperty {
  fileId: number;
  path: string;
  propertyName?: string;
  valueName?: string;
  partNumber?: string;
  productName?: string;
}
