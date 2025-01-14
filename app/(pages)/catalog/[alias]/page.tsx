import { Products } from '@/app/section/Catalogs/components/Products/Products';
import {
  fetchProductsList,
  fetchTreeCategories,
  getCategories,
} from '@/data/api/publicPart/requests';
import React from 'react';
import { createBreadcrumbItems } from '@/data/utils.common';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const categories = await getCategories();
  const aliasCategory =
    categories?.map(category => ({
      alias: category.label,
    })) || [];
  const aliasSubCategory =
    categories?.flatMap(item =>
      item.subCategories.map(subCategory => ({ alias: subCategory.label })),
    ) || [];

  return aliasCategory.concat(aliasSubCategory);
}

interface IQueryParams {
  isOnlyInStock?: string;
  page?: string;
  pageSize?: string;
  autoBrand: string;
  autoType: string;
  autoModels: string[];
  manufacturers: string[];
  price: string;
}
export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: { alias: string };
  searchParams: IQueryParams;
}) {
  const onlyStock = searchParams.isOnlyInStock === 'true';
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const autoType = searchParams.autoType;
  const autoBrand = searchParams.autoBrand;
  const autoModels = searchParams.autoModels || [];
  const manufacturers = searchParams.manufacturers || [];
  const price = searchParams.price;

  try {
    const categoriesSidebar = await fetchTreeCategories();
    const productsList = await fetchProductsList({
      aliasCategory: params.alias,
      autoBrand: autoBrand,
      autoType: autoType,
      autoModels: autoModels,
      manufacturers: manufacturers,
      price: price,
      isOnlyInStock: onlyStock,
      page: page,
      pageSize: pageSize,
    });

    const breadcrumbItems = createBreadcrumbItems(productsList?.categoryTree);

    return (
      <Products
        categoriesSidebar={categoriesSidebar}
        productsList={productsList}
        breadcrumbItems={breadcrumbItems}
        aliasCategory={params.alias}
      />
    );
  } catch (error) {
    console.error('Ошибка запросе страницы:', error);
    return notFound();
  }
}
