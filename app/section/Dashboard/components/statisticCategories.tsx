import { Title } from '@/app/components/Title/Title';
import styles from './statistic.module.css';
import Link from 'next/link';
import { APP_PATHS } from '@/data/paths.data';
import ArrowNextIcon from '@/public/arrowNext.svg';
import PageContent from '@/app/components/PageContent/PageContent';
import classNames from 'classnames';

interface IProps {
  allCategories: number;
  categoriesWithoutProducts: number;
  rootCategories: number;
}

export const StatisticCategories = ({
  allCategories,
  categoriesWithoutProducts,
  rootCategories,
}: IProps) => {
  return (
    <PageContent className={styles.container}>
      <Link
        className={classNames([styles.title, styles.link])}
        href={APP_PATHS.CATEGORIES}
      >
        <Title tag="h3">Категории</Title>
        <ArrowNextIcon />
      </Link>
      <div className={styles.statistic}>
        <div>
          <span>Всего категорий:</span>
          <span className={styles.count}>{allCategories}</span>
        </div>
        <div>
          <span>Категорий первого уровня:</span>
          <span className={styles.count}>{rootCategories}</span>
        </div>
        <div>
          <span>Категории без товаров:</span>
          <span className={styles.count}>{categoriesWithoutProducts} </span>
        </div>
      </div>
    </PageContent>
  );
};
