import Page from '@/app/components/Page/Page';
import React, { Suspense } from 'react';
import CatalogsPageContent from './Content';
import { getCategories } from '@/data/api/publicPart/requests';

export default async function CatalogsPage({}) {
  const categories = await getCategories();
  return (
    <Suspense>
      <Page>
        <CatalogsPageContent categories={categories} />
      </Page>
    </Suspense>
  );
}
