import Page from '@/app/components/Page/Page';
import CategoryPageContent from './Content';
import { Suspense } from 'react';

export default function CategoryPage({ alias }: { alias: string }) {
  return (
    <Suspense>
      <Page>
        <CategoryPageContent alias={alias} />
      </Page>
    </Suspense>
  );
}
