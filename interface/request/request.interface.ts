import React from 'react';
import { IPublicAutoModels } from '../publicPart/publicPart.interface';

export interface ICustomer {
  customerId: number;
  customerName: string;
  inn: string;
  addresses: IAddress[];
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  address: IAddress;
}

export interface IProductList {
  name: string;
  partNumbers: string[];
  amount: number;
  id: number;
}

interface IOrder {
  amount: number;
  averagePrice: number;
  isChanged: boolean;
  name: string;
  isPrefabricatedItem: boolean;
  isClosedByQuantity: boolean;
  isExact: boolean;
  optionsCount: number;
  productOffersCount: number;
  messageAboutChanges: string | null;
  requiredPartNumbers: string[];
  vat: boolean;
  changeParameter: 1 | 2 | 3 | null;
  totalProductsCart: number;
}
export interface ISelected {
  address: string | null;
  catalogPartNumberId: number | null;
  id: string;
  initialPartNumber: string;
  inn: string;
  interbalCode: string;
  isChanged: boolean;
  manufacturer: string;
  manufacturerId: null;
  marketPartNumberId: string;
  partNumber: string;
  partNumberId: number;
  productId: number | null;
  price: number;
  offerId: string;
  productAmount: number;
  productName: string;
  relevance: string;
  selectedAmount: number;
  sellerContacts: null;
  sellerDescription: null;
  sellerId: string;
  sellerName: string;
  vat: boolean;
  warehouseId: string;
  warehouseName: string;
  changeParameter: 1 | 2 | 3 | null;
  positionId: number;
  isSelectedOffer: boolean;
}
export interface ITitleItem {
  name: string | null;
  partNumber: string | null;
  partNumberId: number;
  amount: number;
  manufacturer: string;
  seller: string;
  warehouseName: string;
  relevance: string;
  totalAmount: number;
  selectedId: string;
  offerId: string;
  productId: number | null;
}

export interface IOrders {
  originalProduct: IOrder;
  titleItem: ITitleItem;
  id: number;
  rows: ISelected[];
  selected: ISelected[];
}

export interface IAddress {
  id: number;
  address: string;
  isDefault: boolean;
}

interface IRequest {
  document?: IProductList[];
  id?: number;
  order?: IOrders[];
  status?: string;
  titleId?: string;
}

export interface IFilteringItems {
  manufacturers: IRequestManufacturer[];
  priceMin: number;
  priceMax: number;
  sellers: IRequestSeller[];
}

export interface IAboutRequest {
  request?: IRequest;
  customer?: ICustomer;
  filteringItems?: IFilteringItems;
  info?: IInfoFinished;
}

export interface RequestContextData {
  dataRequest: IAboutRequest;
  setDataRequest: React.Dispatch<React.SetStateAction<IAboutRequest>>;
  loadingTableFormationData: boolean;
  setLoadingTableFormationData: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IRequestManufacturer extends IRequestSeller {
  label: string;
}

export interface IRequestSeller {
  id: number;
  name: string;
}
export interface IReplacementProduct {
  name: string;
  partNumberId: number;
  productId: number;
}

export interface IFinishedData {
  info?: IInfoFinished;
  sellers?: ISellersFinished[];
}
export interface IInfoFinished {
  addedItemsToOrder: number;
  countPositionsInOrder: number;
  numberOfSellers: number;
  total: number;
}

export interface ISellersFinished {
  seller: ISellerFinished;
  products: IProductsFinished[];
}
export interface ISellerFinished {
  id: string;
  name: string;
  totalSum: number;
  dateSync: string;
}
export interface IProductsFinished {
  originalProduct: {
    name: string;
    amount: number;
  };
  selected: {
    positionId: number;
    catalogPartNumberId: number;
    id: string;
    manufacturer: string;
    manufacturerId: number;
    marketPartNumberId: string;
    partNumber: string;
    price: number;
    productAmount: number;
    productName: string;
    relevance: string;
    selectedAmount: number;
    stockBalanceId: string;
    sum: number;
    vat: boolean;
    warehouseId: string;
    warehouseName: string;
  };
}
export interface ICartQuantity {
  orderId: number;
  offerId: string;
  positionId?: number;
  quantity: number;
}

export interface IProductCardModal {
  offers: IOffers[];
  autoModels: IPublicAutoModels[];
}

export interface IOffers {
  id: number;
  offer: {
    address: null;
    changeParameter: null;
    inn: string;
    manufacturer: string;
    manufacturerId: number;
    marketPartNumberId: string;
    offerId: string;
    partNumber: string;
    partNumberId: number;
    price: number;
    productAmount: number;
    productId: number;
    productName: string;
    relevance: string;
    selectedAmount: number;
    sellerId: string;
    sellerName: string;
    stockBalanceId: string;
    vat: boolean;
    warehouseId: string;
    warehouseName: string;
  };
  originalProduct: {
    amount: number | null;
    name: string | null;
  };
}

export interface IPropertyPartNumber {
  property: {
    id: number;
    name: string;
  };
  propertyValue: {
    id: number;
    value: string;
  };

  unit: {
    id: number;
    name: string;
  };
}
export interface ISelectedRows {
  requestId: number;
  name?: string | null;
  partNumber?: string | string[] | null;
  amount?: number;
  positionId: number;
  dateDeadline?: Date;
}
