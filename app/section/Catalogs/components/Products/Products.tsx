'use client';
import Page from '@/app/components/Page/Page';
import { SearchProduct } from '../searchProduct/SearchProduct';
import styles from './products.module.css';
import { Breadcrumb } from 'antd';
import { Title } from '@/app/components/Title/Title';
import PageContent from '@/app/components/PageContent/PageContent';
import { TopFilterPublic } from '../topFilter/TopFilterPublic';
import { useSearchParams } from 'next/navigation';
import { ProductsCard } from './productsCard/ProductsCard';
import { ProductsTable } from './productsTable/ProductsTable';
import { SidebarMenu } from './sidebar/SidebarMenu';
import {
  ICategoriesTree,
  IPublicProducts,
} from '@/interface/publicPart/publicPart.interface';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';

interface IProps {
  categoriesSidebar: ICategoriesTree[] | null;
  productsList: IPublicProducts | null;
  breadcrumbItems: BreadcrumbItemType[];
  aliasCategory: string;
}

export const Products = ({
  categoriesSidebar,
  productsList,
  breadcrumbItems,
  aliasCategory,
}: IProps) => {
  const searchParams = useSearchParams();
  const displayLayout: string | null = searchParams.get('layout');

  return (
    <Page>
      <SearchProduct />
      <Breadcrumb className="bread-crumb" items={breadcrumbItems} />
      <div className={styles.container}>
        <SidebarMenu categoriesTree={categoriesSidebar} />
        <div className={styles.content}>
          <Title tag="h2">
            {productsList?.category.name}{' '}
            {!!productsList?.amount && `(${productsList.amount})`}
          </Title>
          <PageContent>
            <TopFilterPublic labelCategory={aliasCategory} />
            {productsList ? (
              <>
                {displayLayout === 'table' || displayLayout === null ? (
                  <>
                    {productsList?.products.length > 0 ? (
                      <ProductsTable productsList={productsList} />
                    ) : (
                      <div className={styles.notData}>Товаров нет</div>
                    )}
                  </>
                ) : (
                  <>
                    {productsList?.products.length > 0 ? (
                      <ProductsCard productsList={productsList} />
                    ) : (
                      <div className={styles.notData}>Товаров нет</div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className={styles.notData}>Товары не найдены</div>
            )}
          </PageContent>
        </div>
      </div>
    </Page>
  );
};
