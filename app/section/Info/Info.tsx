import { Title } from '@/app/components/Title/Title';
import styles from './info.module.css';
import { IDataInfo } from '@/interface/info/info.intrerface';
import { renderHtml } from '@/data/utils.common';

interface IProps {
  dataInfo: IDataInfo | undefined;
}

export const InfoContent = ({ dataInfo }: IProps) => {
  return (
    <>
      <Title tag="h2" className={styles.title}>
        {dataInfo?.title}
      </Title>
      {dataInfo?.detailText && (
        <div className={styles.detailText}>
          {renderHtml(dataInfo.detailText)}
        </div>
      )}
    </>
  );
};
