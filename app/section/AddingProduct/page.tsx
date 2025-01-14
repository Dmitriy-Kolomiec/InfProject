import Page from '@/app/components/Page/Page';
import AddProductPageContent from './Content';
import React, { Suspense } from 'react';
import { ProductProvider } from '@/context/AddProduct/addProduct.context';

export default function AddProductPage() {
  return (
    <Suspense>
      <Page>
        <ProductProvider>
          <AddProductPageContent />
        </ProductProvider>
      </Page>
    </Suspense>
  );
}
