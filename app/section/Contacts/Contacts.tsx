import Page from '@/app/components/Page/Page';
import React, { Suspense } from 'react';
import { IDataInfo } from '@/interface/info/info.intrerface';
import ContactsPageContent from './Content';

interface IProps {
  contactsInfo: IDataInfo | undefined;
}

export default function ContactsPage({ contactsInfo }: IProps) {
  return (
    <Suspense>
      <Page>
        <ContactsPageContent contactsInfo={contactsInfo} />
      </Page>
    </Suspense>
  );
}
