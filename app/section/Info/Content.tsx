'use client';
import styles from './info.module.css';
import PageContent from '@/app/components/PageContent/PageContent';
import RightArrow from '@/public/arrow-select.svg';
import classNames from 'classnames';
import { InfoContent } from './Info';
import { IDataInfo } from '@/interface/info/info.intrerface';
import Link from 'next/link';
import { APP_PATHS } from '@/data/paths.data';

interface IProps {
  dataInfo: IDataInfo[];
  slug: string;
}

export default function InfoPageContent({ dataInfo, slug }: IProps) {
  const activeDataInfo = dataInfo.find(info => {
    if (info.label === slug) {
      return info;
    }
  });

  return (
    <div className={styles.container}>
      <aside>
        <PageContent>
          {dataInfo?.map(info => (
            <Link
              href={APP_PATHS.INFORMATION_SECTION(info.label)}
              key={info.id}
              className={classNames([styles.link], {
                [styles.active]: slug === info.label || null,
              })}
            >
              {info.title}
              <RightArrow />
            </Link>
          ))}
        </PageContent>
      </aside>
      <section>
        <PageContent>
          <InfoContent dataInfo={activeDataInfo} />
        </PageContent>
      </section>
    </div>
  );
}
