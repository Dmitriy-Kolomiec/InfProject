import { Button, TableProps } from 'antd';
import styles from './tablePartNumbers.module.css';
import { formatPrice, thousandsSeparator } from '@/data/utils.common';
import classNames from 'classnames';
import CartIcon from '@/public/white-cart.svg';
import { IPublicPartNumber } from '@/interface/publicPart/publicPart.interface';
import OriginalManufactureIcon from '@/public/originalManufacture.svg';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { cartActions } from '@/store/slice/cartSlice';
import QuantityCounter from '@/app/components/Counter/QuantityCounter';

type ColumnsType<T> = TableProps<T>['columns'];

interface IProps {
  mainProduct: {
    name: string;
    id: number;
  };
}

export interface ICartItem {
  productName: string;
  productId: number;
  partNumber: string;
  partNumberId: number;
  quantity: number;
  summ: { vat: number; price: number };
  manufacturer: string;
  warehouse: {
    name: string;
    amount: number;
  };
}

export const useTablePartNumbers = ({ mainProduct }: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartProducts = useSelector((s: RootState) => s.cart.products);

  const onSubmitCartProduct = (product: IPublicPartNumber) => {
    const dataProductForCart: ICartItem = {
      productName: mainProduct.name,
      productId: mainProduct.id,
      partNumber: product.partNumber.value,
      partNumberId: product.partNumber.id,
      quantity: 1,
      summ: {
        price: product.price.price,
        vat: product.price.vat,
      },
      manufacturer: product.manufacturer.name,
      warehouse: {
        name: product.warehouse.name,
        amount: product.warehouse.amount,
      },
    };
    dispatch(cartActions.add(dataProductForCart));
  };

  // Проверка, находится ли продукт в корзине (по partNumberId)
  const isProductAdded = (partNumberId: number) => {
    return cartProducts.some(product => product.partNumberId === partNumberId);
  };

  const columns: ColumnsType<IPublicPartNumber> = [
    {
      title: 'Каталожный номер',
      dataIndex: 'partNumber',
      key: 'partNumber',
      width: '25%',
      render: (_, record) => <div>{record.partNumber.value}</div>,
    },
    {
      title: 'Производитель',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: '35%',
      render: (_, record) => (
        <div className={styles.manufacture}>
          <span>{record.manufacturer.name}</span>
          {record.manufacturer.name === 'Оригинал' && (
            <OriginalManufactureIcon />
          )}
        </div>
      ),
    },
    {
      title: 'Склад',
      dataIndex: 'stock',
      key: 'stock',
      width: '18%',
      render: (_, record) => {
        const { warehouse } = record;

        return (
          <div className={styles.stockCell}>
            <span>{warehouse.name}</span>
            {!!warehouse.amount ? (
              <span>{thousandsSeparator(warehouse.amount)} шт</span>
            ) : (
              <span>Под заказ</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Цена, шт',
      dataIndex: 'price',
      key: 'price',
      width: 'auto',
      render: (_, record) => {
        const { price } = record;
        return (
          <div className={styles.price}>
            <div className={styles.summ}>
              {formatPrice(price.price)} &#8381;
            </div>
            <div className={styles.neutralText}>
              {!!price.vat ? 'с НДС' : 'без НДС'}
            </div>
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      key: 'active',
      width: '12%',
      render: (_, record) => {
        const cartProduct = cartProducts.find(
          product => product.partNumberId === record.partNumber.id,
        );
        const count = cartProduct ? cartProduct.quantity : 1;
        return (
          <div className={styles.activeCell}>
            {isProductAdded(record.partNumber.id) ? (
              <QuantityCounter
                count={count}
                setCount={(newCount: number) =>
                  updateQuantity(record.partNumber.id, newCount)
                }
              />
            ) : (
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

  const updateQuantity = (partNumberId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      return dispatch(cartActions.deleteProduct(partNumberId));
    } else {
      dispatch(
        cartActions.updateQuantity({ partNumberId, quantity: newQuantity }),
      );
    }
  };

  return {
    columns,
  };
};
