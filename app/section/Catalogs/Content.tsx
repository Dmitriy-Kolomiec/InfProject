import PageContent from '@/app/components/PageContent/PageContent';
import { SearchProduct } from './components/searchProduct/SearchProduct';
import styles from './catalogs.module.css';
import { Category } from './components/category/Category';
import { Title } from '@/app/components/Title/Title';
import { IPublicCategory } from '@/interface/publicPart/publicPart.interface';
import { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';

interface IProps {
  categories: IPublicCategory[] | null;
  hideDrawer?: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

export default function CatalogsPageContent({
  categories,
  hideDrawer,
  className,
}: IProps) {
  return (
    <div className={styles.container}>
      <SearchProduct />
      <PageContent className={classNames([className, styles.categories])}>
        <>
          {!!categories ? (
            categories.map(category => (
              <Category
                category={category}
                key={category.id}
                hideDrawer={hideDrawer}
              />
            ))
          ) : (
            <Title tag="h2">Категории не найдены</Title>
          )}
        </>
      </PageContent>
    </div>
  );
}
