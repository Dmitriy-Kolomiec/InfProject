'use client';
import React, { useState } from 'react';
import { createContext } from 'react';
import {
  IDataProduct,
  IShouldShow,
  ProductContextData,
} from '../../interface/addingProduct/product.interface';

const initialDataProduct: IDataProduct = {
  product: { id: '' },
};

const initialProductContext: ProductContextData = {
  dataProduct: initialDataProduct,
  setDataProduct: () => {},
  shouldShowComponent: {
    showAddingCategory: false,
    showEditCategory: false,
    showAddingProperties: false,
    showEditProperties: false,
    showAddingVehicle: false,
    showEditVehicle: false,
    showAddingRelations: false,
    showEditRelations: false,
  },
  setShouldShowComponent: () => {},
};

export const ProductContext = createContext<ProductContextData>(
  initialProductContext,
);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dataProduct, setDataProduct] =
    useState<IDataProduct>(initialDataProduct);
  const [shouldShowComponent, setShouldShowComponent] = useState<IShouldShow>({
    showAddingCategory: false,
    showEditCategory: false,
    showAddingProperties: false,
    showEditProperties: false,
    showAddingVehicle: false,
    showEditVehicle: false,
    showAddingRelations: false,
    showEditRelations: false,
  });

  return (
    <ProductContext.Provider
      value={{
        dataProduct,
        setDataProduct,
        shouldShowComponent,
        setShouldShowComponent,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
