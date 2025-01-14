import Page from '@/app/components/Page/Page';
import React, { Suspense } from 'react';
import CartPageContent from './Content';

export default function CartPage() {
  return (
    <Suspense>
      <Page>
        <CartPageContent />
      </Page>
    </Suspense>
  );
}
