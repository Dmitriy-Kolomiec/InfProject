import Page from '@/app/components/Page/Page';
import AddRequestPageContent from './Content';
import React, { Suspense } from 'react';

export default function AddRequestPage() {
  return (
    <Suspense>
      <AddRequest />
    </Suspense>
  );
}

function AddRequest(): React.ReactElement {
  return (
    <Page>
      <AddRequestPageContent />
    </Page>
  );
}
