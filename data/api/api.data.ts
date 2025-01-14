import { API_SERVER_AUTH, API_SERVER_URL, API_SERVER_FILES } from '../env';

export const API_ENDPOINTS = {
  GET_DASHBOARD: `${API_SERVER_URL}/admin/catalog/get-dashboard-data`,
  // PRODUCT
  EDIT_PRODUCT: (id: string) =>
    `${API_SERVER_URL}/admin/catalog/get-product/${id}`,
  ADD_PRODUCT: `${API_SERVER_URL}/admin/catalog/add-product`,
  SAVE_PRODUCT: `${API_SERVER_URL}/admin/catalog/save-product`,
  GET_FILE: (path: string) => `${API_SERVER_URL}/files/catalog/${path}`,
  DELETE_PRODUCT: (id: number) =>
    `${API_SERVER_URL}/admin/catalog/delete-product/${id}`,

  // CATEGORY
  ADD_CATEGORY: `${API_SERVER_URL}/admin/catalog/add-category`,
  EDIT_CATEGORY_PRODUCT: `${API_SERVER_URL}/admin/catalog/product/edit-category`,
  DELETE_CATEGORY_PRODUCT: (id: string) =>
    `${API_SERVER_URL}/admin/catalog/product/delete-category/${id}`,
  GET_CATEGORIES: (parentId: string | null) =>
    `${API_SERVER_URL}/admin/catalog/get-categories${
      parentId ? `?parent=${parentId}` : ''
    }`,
  ADD_CATEGORIES_PRODUCT: `${API_SERVER_URL}/admin/catalog/product/add-category`,
  DELETE_CATEGORY: (id: number) =>
    `${API_SERVER_URL}/admin/catalog/delete-category/${id}`,
  EDIT_CATEGORY: `${API_SERVER_URL}/admin/catalog/edit-category`,

  // PROPERTIES
  GET_PROPERTIES: `${API_SERVER_URL}/admin/catalog/get-properties`,
  GET_PRODUCT_PROPERTIES: (id: string) =>
    `${API_SERVER_URL}/admin/catalog/product/get-properties/${id}`,
  ADD_PROPERTY: `${API_SERVER_URL}/admin/catalog/add-property`,
  GET_UNIT: `${API_SERVER_URL}/admin/catalog/get-units`,
  ADD_PROPERTIES_PRODUCT: `${API_SERVER_URL}/admin/catalog/product/add-property`,
  DELETE_PROPERTY: (id: string) =>
    `${API_SERVER_URL}/admin/catalog/product/delete-property/${id}`,
  EDIT_PROPERTIES: `${API_SERVER_URL}/admin/catalog/product/edit-properties`,

  // VEHICLE
  ADD_PRODUCT_AUTO_MODEL: `${API_SERVER_URL}/admin/catalog/product/add-auto-model`,
  EDIT_PRODUCT_AUTO_MODEL: `${API_SERVER_URL}/admin/catalog/product/edit-auto-model`,
  DELETE_AUTO_MODEL: (id: number) =>
    `${API_SERVER_URL}/admin/catalog/product/delete-auto-model/${id}`,
  GET_PRODUCT_AUTO_MODELS: (id: string) =>
    `${API_SERVER_URL}/admin/catalog/product/get-auto-models/${id}`,
  GET_AUTO_TYPES: `${API_SERVER_URL}/admin/catalog/get-auto-types`,
  ADD_AUTO_TYPE: `${API_SERVER_URL}/admin/catalog/add-auto-type`,
  GET_AUTO_BRANDS: `${API_SERVER_URL}/admin/catalog/get-auto-brands`,
  ADD_AUTO_BRAND: `${API_SERVER_URL}/admin/catalog/add-auto-brand`,
  GET_AUTO_MODEL: (
    autoTypeId: number,
    autoBrandId: number,
    productId?: string,
  ) =>
    `${API_SERVER_URL}/admin/catalog/get-auto-models?auto-type-id=${autoTypeId}&auto-brand-id=${autoBrandId}&product=${productId}`,
  ADD_AUTO_MODEL: `${API_SERVER_URL}/admin/catalog/add-auto-model`,

  // PART NUMBER
  ADD_PRODUCT_PARTNUMBER: `${API_SERVER_URL}/admin/catalog/product/add-partnumber`,
  EDIT_PRODUCT_PARTNUMBER: `${API_SERVER_URL}/admin/catalog/product/edit-partnumber`,
  DELETE_PARTNUMBER: (id: string) =>
    `${API_SERVER_URL}/admin/catalog/product/delete-partnumber/${id}`,
  ADD_MANUFACTURER: `${API_SERVER_URL}/admin/catalog/add-manufacturer`,
  GET_MANUFACTURERS: `${API_SERVER_URL}/admin/catalog/get-manufacturers`,
  SET_PRODUCT_PROPERTY_VALUE: `${API_SERVER_URL}/admin/catalog/product/set-property-value`,

  GET_FULLNES_RATE: (id: string) =>
    `${API_SERVER_URL}/admin/catalog/get-fullness-rate/${id}`,
  GET_PROPERTI_VALUES_COMB: (
    id: string,
    page?: string | null,
    pageSize: number = 100,
  ) =>
    `${API_SERVER_URL}/admin/catalog/get-property-values-comb?productId=${id}&limit=${pageSize}&page=${
      page || 1
    }`,
  SET_NOT_EXIST: `${API_SERVER_URL}/admin/catalog/set-not-exist`,
  GET_NOT_EXIST: (id: string) =>
    `${API_SERVER_URL}/admin/catalog/get-not-exist/${id}`,
  DELETE_NOT_EXIST: (id: string) =>
    `${API_SERVER_URL}/admin/catalog/delete-not-exist/${id}`,
  GET_TREE: (id: string) => `${API_SERVER_URL}/admin/catalog/get-tree/${id}`,

  // LOGIN
  LOGIN: `${API_SERVER_AUTH}/login`,
  REFRESH: `${API_SERVER_AUTH}/refresh`,
  LOGOUT: `${API_SERVER_AUTH}/logout`,
  GET_CODE: `${API_SERVER_AUTH}/code`,
  LOGIN_DIFFERENT_USER: `${API_SERVER_AUTH}/login-different-user`,

  // USER
  GET_DATA_USER: `${API_SERVER_URL}/user/init-data`,
  GET_USERS: `${API_SERVER_URL}/user/list`,
  ADD_USER: `${API_SERVER_URL}/user/create`,
  EDIT_USER: `${API_SERVER_URL}/user/update`,
  DELETE_USER: (userId: string) => `${API_SERVER_URL}/user/delete/${userId}`,

  // CATEGORIES
  GET_CATEGORIES_TREE: (data?: string) =>
    `${API_SERVER_URL}/admin/catalog/get-categories-tree?data=${data}`,
  GET_PRODUCT_LIST: (id: number) =>
    `${API_SERVER_URL}/admin/catalog/get-product-list/${id}`,

  // RELATIONS
  ADD_PRODUCT_CONNECTION: `${API_SERVER_URL}/admin/catalog/product/add-connection`,
  EDIT_PRODUCT_CONNECTION: `${API_SERVER_URL}/admin/catalog/product/edit-connection`,
  // Удаление связанного продукта
  DELETE_RELATED_PRODUCT: (id: number) =>
    `${API_SERVER_URL}/admin/catalog/product/delete-connection/${id}`,
  // Удаление всей связи
  DELETE_RELATION_PRODUCT: (payload: string) =>
    `${API_SERVER_URL}/admin/catalog/product/delete-relations?data=${payload}`,

  // MARKET
  // GET_PRODUCTS_LIST: `${API_SERVER_URL}/market/get-product-list`,
  ADD_CUSTOMER: `${API_SERVER_URL}/seller/requests/add-customer`,
  EDIT_CUSTOMER: `${API_SERVER_URL}/seller/requests/edit-customer`,
  GET_CUSTOMERS: `${API_SERVER_URL}/seller/requests/get-customers`,
  GET_CUSTOMER: (id: number) =>
    `${API_SERVER_URL}/seller/requests/get-customer/${id}`,
  DELETE_CUSTOMER: (id: number) =>
    `${API_SERVER_URL}/seller/requests/delete-customer/${id}`,
  ADD_REQUEST: `${API_SERVER_URL}/seller/requests/add`,
  SAVE_REQUEST: `${API_SERVER_URL}/seller/requests/save`,
  GET_LIST_REQUESTS: `${API_SERVER_URL}/seller/requests/list-orders`,
  GET_REQUEST: (id: string) => `${API_SERVER_URL}/seller/requests/get/${id}`,
  DELETE_REQUEST: (id: number) =>
    `${API_SERVER_URL}/seller/requests/delete/${id}`,
  GET_FILTER_REQUEST: (payload: any) =>
    `${API_SERVER_URL}/seller/requests/filter?requestId=${payload.id}${
      payload.position || ''
    }${payload.price || ''}${payload.manufacturers || ''}${
      payload.sellers || ''
    }${payload.onlyInStock || ''}`,
  SEARCH_REQUEST: `${API_SERVER_URL}/seller/requests/search`,
  SEARCH_BY_STRING: (str: string) =>
    `${API_SERVER_URL}/seller/requests/suggester?field=name&q=${str}`,
  REQUEST_FINISHED: (id: number) =>
    `${API_SERVER_URL}/seller/requests/get-finished-order/${id}`,
  DELETE_POSITION_REQUEST: `${API_SERVER_URL}/seller/requests/delete-positions`,
  REQUEST_CART: `${API_SERVER_URL}/seller/requests/cart`,
  GET_PRODUCT_CARD: (payload: string) =>
    `${API_SERVER_URL}/seller/requests/get-product-card?data=${payload}`,
  GET_PARTNUMBER_PROPERTIES: (partNumberId: number) =>
    `${API_SERVER_URL}/seller/requests/get-partnumber-properties/${partNumberId}`,

  ADD_SUPPLY_REQUEST: `${API_SERVER_URL}/seller/requests/supply-request`,
  GET_SUPPLY_REQUESTS: (
    display: string | undefined,
    page: number,
    pageSize: number,
  ) =>
    `${API_SERVER_URL}/seller/requests/supply-request-list?mode=${display}&page=${page}&limit=${pageSize}`,

  // FILES
  GET_TEMPLATE_XLSX: `${API_SERVER_FILES}/files/documents/template.xlsx`,
  GET_REQUEST_COMPETITIVE_LIST: (orderId: number) =>
    `${API_SERVER_URL}/seller/requests/competitive-list/${orderId}`,

  // PUBLIC_PART
  GET_LIST_CATEGORIES: `${API_SERVER_URL}/public/get-list-categories`,
  GET_TREE_CATEGORIES: `${API_SERVER_URL}/public/get-categories`,
  GET_PRODUCTS_BY_CATEGORY: (payload: string) =>
    `${API_SERVER_URL}/public/search?filters=${payload}`,
  GET_PUBLIC_MANUFACTURERS: `${API_SERVER_URL}/public/manufacturers`,
  GET_PUBLIC_AUTO_TYPES: `${API_SERVER_URL}/public/auto-types`,
  GET_PUBLIC_AUTO_BRANDS: (autoType: string) =>
    `${API_SERVER_URL}/public/auto-brands?auto-type=${autoType}`,
  GET_PUBLIC_AUTO_MODEL: (autoType: string, autoBrand: string) =>
    `${API_SERVER_URL}/public/auto-models?auto-type=${autoType}&auto-brand=${autoBrand}`,

  GET_PUBLIC_PRODUCT: (productId: number, partnumber?: number | null) =>
    `${API_SERVER_URL}/public/product?id=${productId}&partnumber=${partnumber}`,
  GET_PUBLIC_BREADCRUMB: (productId: number) =>
    `${API_SERVER_URL}/public/breadcrumbs/${productId}`,
  GET_PUBLIC_PROPERTIES_TREE: (productId: number) =>
    `${API_SERVER_URL}/public/product-as-tree?id=${productId}`,
  GET_PUBLIC_PARTNUMBER: (payload: string) =>
    `${API_SERVER_URL}/public/part-numbers/search?data=${payload}`,
  GET_PUBLIC_INFORMATION: `${API_SERVER_URL}/public/information`,
  PUBLIC_ORDER: `${API_SERVER_URL}/public/order`,
  GET_PUBLIC_AVAILABLE_PRODUCTS: (payload: string) =>
    `${API_SERVER_URL}/public/available-products?data=${payload}`,

  // Search
  GET_PUBLIC_SEARCH: (payload: string) =>
    `${API_SERVER_URL}/public/search-content?data=${payload}`,
};
