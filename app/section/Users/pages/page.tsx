import Page from '@/app/components/Page/Page';
import AddingUsersPageContent from './Content';
import React from 'react';

export default function UsersPage(): React.ReactElement {
  return (
    <Page>
      <AddingUsersPageContent />
    </Page>
  );
}
