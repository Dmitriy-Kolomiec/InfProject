import styles from './contscts.module.css';
import PageContent from '@/app/components/PageContent/PageContent';

import { IDataInfo } from '@/interface/info/info.intrerface';
import { Title } from '@/app/components/Title/Title';
import { renderHtml } from '@/data/utils.common';

interface IProps {
  contactsInfo: IDataInfo | undefined;
}

export default function ContactsPageContent({ contactsInfo }: IProps) {
  return (
    <PageContent className={styles.container}>
      <section>
        <Title tag="h2" className={styles.title}>
          {contactsInfo?.title}
        </Title>
        {contactsInfo?.detailText && (
          <div className={styles.detailText}>
            {renderHtml(contactsInfo.detailText)}
          </div>
        )}
      </section>
    </PageContent>
  );
}
