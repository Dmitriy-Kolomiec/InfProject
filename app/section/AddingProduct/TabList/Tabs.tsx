import TabDescription from './Description/Description';
import React from 'react';
import TabOptions from './TabOptions/Options';
import TabPartnumbers from './CatalogNumbers/Content';
import TabRelations from './Сonnections/Relations';

interface ITabs {
  activeTab: string | null;
}

export default function AddProductPageContentTabs({
  activeTab,
}: ITabs): React.ReactElement {
  if (activeTab === 'relations') {
    return <TabRelations />;
  }

  if (activeTab === 'partnumbers') {
    return <TabPartnumbers />;
  }

  if (activeTab === 'options') {
    return <TabOptions />;
  }

  return <TabDescription />;
}
