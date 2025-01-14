import { ProductCard } from '../../cardProduct/ProductCard';
import styles from './productsCard.module.css';
import { Pagination, Select } from 'antd';
import { getPopupContainer } from '@/data/utils.common';
import { useProductsCard } from './useProductsCard.hook';
import { IPublicProducts } from '@/interface/publicPart/publicPart.interface';

interface IProps {
  productsList: IPublicProducts | null;
}

export const ProductsCard = ({ productsList }: IProps) => {
  const { page, pageSize, handleChangeSelect, onChangePagination } =
    useProductsCard();

  return (
    <>
      <ul
        className={styles.productsList}
        itemScope
        itemType="http://schema.org/ItemList"
      >
        {productsList?.products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
      <div className={styles.pagination}>
        <Pagination
          defaultCurrent={page}
          total={productsList?.amount}
          pageSize={pageSize}
          onChange={onChangePagination}
        />
        {productsList && productsList?.amount > 10 && (
          <div className={styles.select}>
            <span className={styles.labelSelect}>Отображать по</span>
            <Select
              getPopupContainer={getPopupContainer}
              defaultValue="10"
              onChange={handleChangeSelect}
              popupMatchSelectWidth={60}
              options={[
                {
                  value: '10',
                  label: '10',
                },
                {
                  value: '20',
                  label: '20',
                },
                {
                  value: '50',
                  label: '50',
                },
                {
                  value: '100',
                  label: '100',
                },
              ]}
            />
          </div>
        )}
      </div>
    </>
  );
};
