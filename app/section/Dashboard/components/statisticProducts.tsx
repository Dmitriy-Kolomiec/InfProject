import { Title } from '@/app/components/Title/Title';
import styles from './statistic.module.css';
import Link from 'next/link';
import { APP_PATHS } from '@/data/paths.data';
import ArrowNextIcon from '@/public/arrowNext.svg';
import PageContent from '@/app/components/PageContent/PageContent';

interface IProps {
  allProducts: number;
  productsWithoutCategories: number;
}

export const StatisticProduct = ({
  allProducts,
  productsWithoutCategories,
}: IProps) => {
  return (
    <PageContent className={styles.container}>
      <div className={styles.title}>
        <Title tag="h3">Товары</Title>
      </div>
      <div className={styles.statistic}>
        <div>
          <span>Всего товаров:</span>
          <span className={styles.count}>{allProducts}</span>
        </div>
        <div>
          <span>Товаров вне категорий:</span>
          <span className={styles.count}>{productsWithoutCategories}</span>
        </div>
      </div>
    </PageContent>
  );
};
