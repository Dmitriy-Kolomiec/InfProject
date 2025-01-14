import { ITree } from '@/app/section/Category/pages/useCategory.hook';
import styles from './productList.module.css';
import { IProduct } from '@/interface/addingProduct/product.interface';
import { Title } from '@/app/components/Title/Title';
import { Button } from 'antd';
import classNames from 'classnames';
import { Dispatch, SetStateAction, useState } from 'react';
import { Skelet } from '@/app/components/Skeleton/Skeleton';

interface IProps {
  productList?: IProduct[];
  setRelatedProduct: Dispatch<SetStateAction<IProduct[] | undefined>>;
}

export const ProductList = ({ productList, setRelatedProduct }: IProps) => {
  const [selectRow, setSelectRow] = useState<string | number>();

  const handleRow = (product: IProduct) => {
    setSelectRow(product.id);
    setRelatedProduct(prevState => {
      const productExists = prevState?.find(p => p.id === product.id);
      if (productExists) {
        // Обновляем существующий продукт
        return prevState?.map(p => (p.id === product.id ? product : p));
      } else {
        // Добавляем новый продукт
        return [...(prevState || []), product];
      }
    });
  };

  return (
    <div className={styles.container}>
      <Title tag="h3" className={styles.title}>
        Выберите товар
      </Title>
      {productList ? (
        <ul>
          {productList.map(product => (
            <li
              className={classNames([styles.item], {
                [styles.active]: product.id === selectRow,
              })}
              onClick={() => handleRow(product)}
              key={product.id}
            >
              {product.name}
            </li>
          ))}
        </ul>
      ) : (
        <Skelet renderCount={11} />
      )}
    </div>
  );
};
