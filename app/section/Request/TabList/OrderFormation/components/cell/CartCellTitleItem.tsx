import { ICartQuantity, IOrders } from '@/interface/request/request.interface';
import { useState } from 'react';
import styles from './cells.module.css';
import { Button, Tooltip } from 'antd';
import classNames from 'classnames';
import QuantityCounter from '@/app/components/Counter/QuantityCounter';
import ExtarnalLinkIcon from '@/public/extarnalLink.svg';
import CartIcon from '@/public/white-cart.svg';

interface IProps {
  record: IOrders;
  requestId: number;
  updateQuantity: (value: ICartQuantity) => void;
  openReplacementProductModal: (record: IOrders) => void;
}

export const CartCellTitleItem = ({
  record,
  requestId,
  updateQuantity,
  openReplacementProductModal,
}: IProps) => {
  const {
    optionsCount,
    productOffersCount,
    totalProductsCart,
    isPrefabricatedItem,
    amount,
  } = record.originalProduct;
  const { totalAmount, offerId, productId } = record.titleItem;
  const [quantityCount, setQuantityCount] = useState<number>(totalProductsCart);

  if ((!optionsCount && !productOffersCount) || !optionsCount) {
    return <div className={styles.hideCartButton}>-</div>;
  }

  const productAddCart = (product: ICartQuantity) => {
    updateQuantity(product);
    setQuantityCount(product.quantity);
  };

  return (
    <>
      {optionsCount <= 1 && requestId && (
        <div className={styles.buttonActions}>
          {productId ? (
            <Button
              className={classNames(['button-white', styles.refreshButton])}
              onClick={() => {
                openReplacementProductModal(record);
              }}
            >
              <Tooltip title="Открыть карточку товара">
                <ExtarnalLinkIcon />
              </Tooltip>
            </Button>
          ) : (
            <div className={styles.refreshButton}></div>
          )}
          {quantityCount > 0 ? (
            <QuantityCounter
              count={quantityCount}
              setCount={(newCount: number) => {
                if (newCount === 0) {
                  setQuantityCount(0);
                }
                setQuantityCount(newCount);
                updateQuantity({
                  orderId: requestId,
                  positionId: record.id,
                  offerId: offerId,
                  quantity: newCount,
                });
              }}
              disabledUp={totalAmount}
            />
          ) : (
            <Button
              className={classNames(['button-primary', styles.cartButton])}
              onClick={() => {
                productAddCart({
                  orderId: requestId,
                  positionId: record.id,
                  offerId: offerId,
                  quantity: amount,
                });
              }}
              icon={<CartIcon />}
            >
              В корзину
            </Button>
          )}
        </div>
      )}
      {isPrefabricatedItem && (
        <div className={styles.countInCart}>
          <span>{totalProductsCart}</span>
          <span className={styles.neutralColor}>В корзине</span>
        </div>
      )}
    </>
  );
};
