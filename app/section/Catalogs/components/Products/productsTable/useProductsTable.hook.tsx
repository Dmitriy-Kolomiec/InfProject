import { Button, TableProps } from 'antd';
import styles from './productsTable.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { APP_PATHS } from '@/data/paths.data';
import { IPublicProducts } from '@/interface/publicPart/publicPart.interface';
import { formatPrice } from '@/data/utils.common';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import QuantityCounter from '@/app/components/Counter/QuantityCounter';
import classNames from 'classnames';
import CartIcon from '@/public/white-cart.svg';
import { cartActions } from '@/store/slice/cartSlice';
import { ICartItem } from '@/app/components/Product/components/tablePartNumbers/useTablePartNumbers.hook';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type ColumnsType<T> = TableProps<T>['columns'];

interface ITableData {
  key: string;
  name: string;
  id: number;
  partNumber: string;
  partNumberId: number;
  manufacturer: string;
  price: number;
  vat: number;
  rowSpan: number;
  warehouse: {
    name: string;
    amount: number;
  };
}

interface IProps {
  productsList: IPublicProducts | null;
}

export const useProductsTable = ({ productsList }: IProps) => {
  const searchParams = useSearchParams();
  const pageSize: number = Number(searchParams.get('pageSize')) || 10;
  const page: number = Number(searchParams.get('page')) || 1;
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isDisabledViewPageSize, setIsDisabledViewPageSize] =
    useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const cartProducts = useSelector((s: RootState) => s.cart.products);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Изменение значения pageSize через Select
  const handleChangeSelect = (value: string) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set('pageSize', String(value || 10));
    router.replace(`${pathname}?${queryParams.toString()}`, {
      scroll: false,
    });
  };
  // Изменение значения page через Пагинацию
  const onChangePage = (value: number) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set('page', String(value || 1));
    router.replace(`${pathname}?${queryParams.toString()}`);
  };

  const tableData: ITableData[] = [];
  const nameCountMap: Record<string, number> = {};
  productsList?.products.forEach(product => {
    product.data.forEach((item, index) => {
      const name = product.name || '';
      tableData.push({
        key: `${product.id}__${index}`,
        name: name,
        id: product.id,
        partNumber: item.partNumber.value,
        partNumberId: item.partNumber.id,
        manufacturer: item.manufacturer.name,
        price: item.stockBalance.price,
        vat: item.stockBalance.vat,
        rowSpan: 1,
        warehouse: {
          name: item.warehouse.name,
          amount: item.warehouse.amount,
        },
      });

      if (name) {
        nameCountMap[name] = (nameCountMap[name] || 0) + 1;
      }
    });
  });
  let lastSeenName = '';
  tableData.forEach(row => {
    if (row.name !== lastSeenName) {
      row.rowSpan = nameCountMap[row.name] || 1;
      lastSeenName = row.name;
    } else {
      row.rowSpan = 0;
    }
  });

  const isProductAdded = (partNumberId: number) => {
    return cartProducts.some(product => product.partNumberId === partNumberId);
  };

  const updateQuantity = (partNumberId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      return dispatch(cartActions.deleteProduct(partNumberId));
    }
    dispatch(
      cartActions.updateQuantity({ partNumberId, quantity: newQuantity }),
    );
  };

  const onSubmitCartProduct = (product: ITableData) => {
    const dataProductForCart: ICartItem = {
      productName: product.name,
      productId: product.id,
      partNumber: product.partNumber,
      partNumberId: product.partNumberId,
      quantity: 1,
      summ: {
        price: product.price,
        vat: product.vat,
      },
      manufacturer: product.manufacturer,
      warehouse: {
        name: product.warehouse.name,
        amount: product.warehouse.amount,
      },
    };
    dispatch(cartActions.add(dataProductForCart));
  };

  const columns: ColumnsType<ITableData> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      width: '42%',
      className: styles.cellName,
      onCell: row => ({
        rowSpan: row.rowSpan,
      }),
      render: (value, row) => {
        if (value) {
          return (
            <Link
              href={APP_PATHS.PUBLIC_PRODUCT(Number(row.key.split('__')[0]))}
              className={styles.link}
            >
              {value}
            </Link>
          );
        }
        return null;
      },
    },
    {
      title: 'Каталожный номер',
      dataIndex: 'partNumber',
      key: 'partNumber',
      width: '26%',
      render: (value, row) => {
        if (value) {
          return (
            <Link
              href={{
                pathname: APP_PATHS.PUBLIC_PRODUCT(
                  Number(row.key.split('__')[0]),
                ),
                query: { partnumber: row.partNumberId },
              }}
              className={styles.link}
            >
              {value}
            </Link>
          );
        }
        return null;
      },
    },
    {
      title: 'Производитель',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: '16%',
    },
    {
      title: 'Цена, шт',
      dataIndex: 'price',
      key: 'price',
      width: '16%',
      render: (price, record) => (
        <div className={styles.price}>
          <div className={styles.summ}>{formatPrice(price)} &#8381;</div>
          <div className={styles.neutralText}>
            {!!record.vat ? 'с НДС' : 'без НДС'}
          </div>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: '',
      key: 'active',
      width: '12%',
      render: (_, record) => {
        const cartProduct = cartProducts.find(
          product => product.partNumberId === record.partNumberId,
        );
        const count = cartProduct ? cartProduct.quantity : 1;
        return (
          <div className={styles.activeCell}>
            {isMounted ? (
              <>
                {isProductAdded(record.partNumberId) ? (
                  <QuantityCounter
                    setCount={(newCount: number) =>
                      updateQuantity(record.partNumberId, newCount)
                    }
                    count={count}
                  />
                ) : (
                  <Button
                    className={classNames([
                      'button-primary',
                      styles.cartButton,
                    ])}
                    onClick={() => onSubmitCartProduct(record)}
                  >
                    <CartIcon />В корзину
                  </Button>
                )}
              </>
            ) : (
              // Заглушка для первой отрисовки, что бы не мелькал экран.
              <Button
                className={classNames(['button-primary', styles.cartButton])}
                onClick={() => onSubmitCartProduct(record)}
              >
                <CartIcon />В корзину
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return {
    page,
    pageSize,
    isDisabledViewPageSize,
    tableData,
    columns,
    handleChangeSelect,
    onChangePage,
  };
};
