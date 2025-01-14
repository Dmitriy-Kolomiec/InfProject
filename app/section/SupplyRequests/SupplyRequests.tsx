import Page from '@/app/components/Page/Page';
import { SupplyRequestsPageContent } from './Content';
import { Suspense } from 'react';

export const SupplyRequestsPage = () => {
  return (
    <Suspense>
      <Page>
        <SupplyRequestsPageContent />
      </Page>
    </Suspense>
  );
};
