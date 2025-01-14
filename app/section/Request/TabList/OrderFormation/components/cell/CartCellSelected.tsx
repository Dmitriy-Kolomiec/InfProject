import {
  ICartQuantity,
  IOrders,
  ISelected,
} from '@/interface/request/request.interface';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import styles from './cells.module.css';
import { Button, Tooltip } from 'antd';
import classNames from 'classnames';
import QuantityCounter from '@/app/components/Counter/QuantityCounter';
import ExtarnalLinkIcon from '@/public/extarnalLink.svg';
import CartIcon from '@/public/white-cart.svg';
import { RequestContext } from '@/context/Request/request.context';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';

interface IProps {
  record: ISelected;
  requestId: number;
  updateQuantity: (value: ICartQuantity) => Promise<boolean>;
  openReplacementProductModal: (record: ISelected) => void;
  setSelectedProduct: Dispatch<SetStateAction<IOrders | null | undefined>>;
  setShowOtherOffers: Dispatch<SetStateAction<boolean>>;
}

export const CartCellSelected = ({
  record,
  requestId,
  updateQuantity,
  openReplacementProductModal,
  setSelectedProduct,
  setShowOtherOffers,
}: IProps) => {
  const {
    selectedAmount,
    offerId,
    productAmount,
    positionId,
    isSelectedOffer,
    productId,
  } = record;
  const [quantityCount, setQuantityCount] = useState<number>(selectedAmount);
  const { setDataRequest } = useContext(RequestContext);
  const [loading, setLoading] = useState<boolean>(false);

  const productAddSelected = async (product: ICartQuantity) => {
    const updateSuccess = await updateQuantity(product);

    if (updateSuccess) {
      setQuantityCount(product.quantity);

      if (!isSelectedOffer) {
        setLoading(true);
        setQuantityCount(0);
        const position = `&positionId=${product.positionId}`;
        const payload = {
          id: product.orderId,
          position,
        };

        try {
          const { data } = await APIRequest.get<IOrders>(
            API_ENDPOINTS.GET_FILTER_REQUEST(payload),
          );
          if (data) {
            setDataRequest(prevDataRequest => ({
              ...prevDataRequest,
              request: {
                ...prevDataRequest.request,
                order: prevDataRequest.request?.order?.map(order =>
                  order.id === data.id ? data : order,
                ),
              },
            }));
            setSelectedProduct(data);
            setQuantityCount(0);
            if (data.rows) {
              setShowOtherOffers(true);
            }
          }
        } catch (error) {
          console.error('Ошибка при выполнении GET_FILTER_REQUEST:', error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
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
      {!!quantityCount ? (
        <QuantityCounter
          count={quantityCount}
          setCount={(newCount: number) => {
            if (newCount === 0) {
              setQuantityCount(0);
            }

            updateQuantity({
              orderId: requestId,
              positionId: positionId,
              offerId: offerId,
              quantity: newCount,
            });
          }}
          disabledUp={productAmount}
          className="counter-expanded"
        />
      ) : (
        <Button
          className={classNames([
            'button-primary',
            'cartButton-expanded',
            styles.cartButton,
          ])}
          onClick={() =>
            productAddSelected({
              orderId: requestId,
              positionId: positionId,
              offerId: offerId,
              quantity: 1,
            })
          }
          loading={loading}
          icon={<CartIcon />}
        >
          В корзину
        </Button>
      )}
    </div>
  );
};
