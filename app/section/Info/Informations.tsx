import Page from '@/app/components/Page/Page';
import React, { Suspense } from 'react';
import InfoPageContent from './Content';
import { IDataInfo } from '@/interface/info/info.intrerface';

interface IProps {
  dataInfo: IDataInfo[];
  slug: string;
}

export default function InfoPage({ dataInfo, slug }: IProps) {
  return (
    <Suspense>
      <Page>
        <InfoPageContent dataInfo={dataInfo} slug={slug} />
      </Page>
    </Suspense>
  );
}
