import Page from '@/app/components/Page/Page';
import CategoriesPageContent from './Content';
import React, { Suspense } from 'react';

export default function CategoriesPage(): React.ReactElement {
  return (
    <Suspense>
      <Page>
        <CategoriesPageContent />
      </Page>
    </Suspense>
  );
}
