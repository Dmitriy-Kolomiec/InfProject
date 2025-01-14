import { Button, Form, TableProps } from 'antd';
import styles from './cart.module.css';
import { APP_PATHS } from '@/data/paths.data';
import { useRef, useState } from 'react';
import {
  cleanPhoneNumber,
  formatPrice,
  notify,
  thousandsSeparator,
} from '@/data/utils.common';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import OriginalManufactureIcon from '@/public/originalManufacture.svg';
import QuantityCounter from '@/app/components/Counter/QuantityCounter';
import { cartActions } from '@/store/slice/cartSlice';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ICartItem } from '@/app/components/Product/components/tablePartNumbers/useTablePartNumbers.hook';

export const useCart = () => {
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isStatusOrder, setIsStatusOrder] = useState<boolean>(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(false);
  const [isOpenModalOrderSuccessful, setIsOpenModalOrderSuccessful] =
    useState<boolean>(false);
  const [isDisabledFormSubmit, setIsDisabledFormSubmit] =
    useState<boolean>(true);
  const [phone, setPhone] = useState<string>('');

  const router = useRouter();
  const [form] = Form.useForm();
  const nodeRef = useRef(null);
  const dispatch = useDispatch<AppDispatch>();
  const CHECKING_FIELDS_NAME = ['name', 'email'];
  const cartProducts = useSelector((s: RootState) => s.cart.products);

  const onFinishSubmit = async (value: { name: string; email: string }) => {
    setIsLoadingOrder(true);
    const productsRequest = cartProducts.map(product => {
      return {
        productName: product.productName,
        productId: product.productId,
        partNumber: product.partNumber,
        quantity: product.quantity,
        price: product.summ.price,
      };
    });
    const bodyRequest = {
      products: productsRequest,
      contact: {
        name: value.name,
        phone: cleanPhoneNumber(phone),
        email: value.email,
      },
    };

    try {
      const { data } = await APIRequest.post(
        API_ENDPOINTS.PUBLIC_ORDER,
        bodyRequest,
      );

      if (data) {
        setIsOpenModalOrderSuccessful(true);
        setIsStatusOrder(true);
      }
    } catch (error) {
      console.log('Ошибка:', error);
      if (axios.isAxiosError(error) && error.message) {
        notify('error', {
          message: error.message,
        });
      }
    } finally {
      setIsLoadingOrder(false);
    }
  };

  const changePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const validateFormMessages = {
    required: '${label} is required!',
    types: {
      email: 'Введите корркетный e-mail адрес',
    },
  };

  type ColumnsType<T> = TableProps<T>['columns'];
  const columns: ColumnsType<ICartItem> = [
    {
      title: 'Каталожный номер',
      dataIndex: 'partNumber',
      key: 'partNumber',
      width: '25%',
      // render: (_, record) => <div>{record.partNumber.value}</div>,
    },
    {
      title: 'Производитель',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: '30%',
      render: manufacturer => (
        <div className={styles.manufacture}>
          <span>{manufacturer}</span>
          {manufacturer === 'Оригинал' && <OriginalManufactureIcon />}
        </div>
      ),
    },
    {
      title: 'Склад',
      dataIndex: 'stock',
      key: 'stock',
      width: '16%',
      render: (_, record) => (
        <div className={styles.stockCell}>
          <span>{record.warehouse.name}</span>
          {!!record.warehouse.amount ? (
            <span>{thousandsSeparator(record.warehouse.amount)} шт</span>
          ) : (
            <span>Под заказ</span>
          )}
        </div>
      ),
    },
    {
      title: 'Цена, шт',
      dataIndex: 'price',
      key: 'price',
      width: 'auto',
      render: (_, record) => {
        return (
          <div className={styles.price}>
            <div className={styles.summ}>
              {formatPrice(record.summ.price)} &#8381;
            </div>
            <div className={styles.neutralText}>
              {!!record.summ.vat ? 'с НДС' : 'без НДС'}
            </div>
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      key: 'count',
      width: '10%',
      align: 'center',
      render: (_, record) => {
        const cartProduct = cartProducts.find(
          product => product.partNumberId === record.partNumberId,
        );
        const count = cartProduct ? cartProduct.quantity : 1;

        return (
          <QuantityCounter
            count={count}
            setCount={(newCount: number) =>
              updateQuantity(record.partNumberId, newCount)
            }
          />
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      key: 'delete',
      width: '5%',
      render: (_, record) => {
        return (
          <Button
            className="button-transparent"
            onClick={() => deleteCartProduct(record.partNumberId)}
          >
            <DeleteIcon />
          </Button>
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

  const deleteCartProduct = (partNumberId: number) => {
    dispatch(cartActions.deleteProduct(partNumberId));
  };

  const closeModal = () => {
    dispatch(cartActions.removeCartProducts());
    setIsOpenModalOrderSuccessful(false);
    router.push(APP_PATHS.HOME);
  };

  return {
    isLoadingOrder,
    isLoadingData,
    setIsLoadingData,
    isOpenModalOrderSuccessful,
    isDisabledFormSubmit,
    setIsDisabledFormSubmit,
    phone,
    form,
    nodeRef,
    cartProducts,
    onFinishSubmit,
    changePhone,
    columns,
    closeModal,
    CHECKING_FIELDS_NAME,
    validateFormMessages,
    isStatusOrder,
  };
};
