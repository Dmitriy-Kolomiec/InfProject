export const APP_PATHS = {
  HOME: '/',
  CART: '/cart',
  LOGIN: '/login',
  REQUEST: '/request',
  SEARCH: '/search',
  INFO: '/info',
  CATALOG: '/catalog',
  CONTACTS: '/contacts',
  ADMIN: '/admin',

  // Request
  REQUESTS_ADD: '/seller/requests/add',
  REQUESTS_VIEW: (id: string | number) => `/seller/requests/${[id]}`,
  REQUESTS_LIST: `/seller/requests`,
  SUPPLY_REQUESTS: '/seller/supply-requests',

  // Categories
  CATEGORIES: '/admin/categories',
  CATEGORY: (id: string | number) => `/admin/categories/${[id]}`,
  CATEGORY_EDIT: '/admin/categories/edit',

  // ADD  PRODUCTS
  PRODUCTS_CATEGORY: '/admin/products',
  ADD_PRODUCT: '/admin/product/add',
  EDIT_PRODUCT: '/admin/product/edit',
  AUTO_MODEL: '/admin/products/model',
  SPARE_PARTS: '/admin/products/model/spareParts',

  // PUBLIC_PART:
  PUBLIC_CATALOG: (alias: string) => `/catalog/${[alias]}`,
  PUBLIC_PRODUCT: (alias: number) => `/catalog/product/${[alias]}`,
  // Adding users
  USERS: '/admin/users',
  // INFORMATION SECTION
  INFORMATION_SECTION: (slug: string) => `/info/${[slug]}`,
};
