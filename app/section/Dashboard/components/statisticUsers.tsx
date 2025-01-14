import { Title } from '@/app/components/Title/Title';
import styles from './statistic.module.css';
import Link from 'next/link';
import { APP_PATHS } from '@/data/paths.data';
import ArrowNextIcon from '@/public/arrowNext.svg';
import PageContent from '@/app/components/PageContent/PageContent';
import classNames from 'classnames';

interface IProps {
  allUsers: number;
  moderators: number;
  administrators: number;
  sellers: number;
}

export const StatisticUsers = ({
  allUsers,
  moderators,
  administrators,
  sellers,
}: IProps) => {
  return (
    <PageContent className={styles.container}>
      <Link
        className={classNames([styles.title, styles.link])}
        href={APP_PATHS.USERS}
      >
        <Title tag="h3">Пользователи системы</Title>
        <ArrowNextIcon />
      </Link>
      <div className={styles.statistic}>
        <div>
          <span>Всего пользователей:</span>
          <span className={styles.count}>{allUsers}</span>
        </div>
        <div>
          <span>С правами администратора:</span>{' '}
          <span className={styles.count}>{administrators}</span>
        </div>
        <div>
          <span>С правами модератора:</span>
          <span className={styles.count}>{moderators}</span>
        </div>
        <div>
          <span>С правами продавца:</span>
          <span className={styles.count}>{sellers}</span>
        </div>
      </div>
    </PageContent>
  );
};
