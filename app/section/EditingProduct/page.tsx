'use client';
import Page from '@/app/components/Page/Page';
import EditProductPageContent from './Content';
import React, { Suspense } from 'react';
import { ProductProvider } from '@/context/AddProduct/addProduct.context';

export default function AddProductPage() {
  return (
    <Suspense>
      <Page>
        <ProductProvider>
          <EditProductPageContent />
        </ProductProvider>
      </Page>
    </Suspense>
  );
}
