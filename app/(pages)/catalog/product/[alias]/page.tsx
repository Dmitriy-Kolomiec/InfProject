import {
  fetchBreadcrumb,
  fetchProduct,
  fetchPropertiesTree,
} from '@/data/api/publicPart/requests';
import React from 'react';
import { notFound } from 'next/navigation';
import Page from '@/app/components/Page/Page';
import { Product } from '@/app/components/Product/Product';
import { createBreadcrumbItems } from '@/data/utils.common';
import PageContent from '@/app/components/PageContent/PageContent';
import { Title } from '@/app/components/Title/Title';

// export async function generateStaticParams() {
//   const categories = await getCategories();
//   const aliasCategory =
//     categories?.map(category => ({
//       alias: category.label,
//     })) || [];
//   const aliasSubCategory =
//     categories?.flatMap(item =>
//       item.subCategories.map(subCategory => ({ alias: subCategory.label })),
//     ) || [];

//   return aliasCategory.concat(aliasSubCategory);
// }

interface IQueryParams {
  partnumber: string;
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { alias: string };
  searchParams: IQueryParams;
}) {
  const partnumber = searchParams.partnumber;

  try {
    const dataProduct = await fetchProduct({
      aliasProductId: Number(params.alias),
      partnumber: Number(partnumber),
    });
    const breadCrumb = await fetchBreadcrumb({
      aliasProductId: Number(params.alias),
    });
    const breadcrumbItems = createBreadcrumbItems(breadCrumb!);
    const propertiesTree = await fetchPropertiesTree({
      aliasProductId: Number(params.alias),
    });

    if (dataProduct) {
      return (
        <Page>
          <Product
            dataProduct={dataProduct}
            breadcrumbItems={breadcrumbItems}
            propertiesTree={propertiesTree}
          />
        </Page>
      );
    }
    return (
      <Page>
        <PageContent isCenter>
          <Title tag="h3">Товар не найден</Title>
        </PageContent>
      </Page>
    );
  } catch (error) {
    console.error('Ошибка запросе страницы:', error);
    return notFound();
  }
}
