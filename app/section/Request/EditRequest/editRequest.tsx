import Page from '@/app/components/Page/Page';
import React, { Suspense } from 'react';
import { RequestProvider } from '@/context/Request/request.context';
import EditRequestPageContent from './Content';

export default function EditRequestPage({ alias }: { alias: string }) {
  return (
    <Suspense>
      <EditRequest alias={alias} />
    </Suspense>
  );
}

function EditRequest({ alias }: { alias: string }) {
  return (
    <Page>
      <RequestProvider>
        <EditRequestPageContent alias={alias} />
      </RequestProvider>
    </Page>
  );
}
