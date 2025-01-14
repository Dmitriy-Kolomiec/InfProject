import { Button, TableProps, Tooltip } from 'antd';
import { useState, useContext, useEffect } from 'react';
import styles from './orderFormation.module.css';
import {
  formatDate,
  formatPrice,
  notify,
  thousandsSeparator,
} from '@/data/utils.common';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { RequestContext } from '@/context/Request/request.context';
import {
  ICartQuantity,
  IOrders,
  IReplacementProduct,
  ISelected,
  ISelectedRows,
} from '@/interface/request/request.interface';
import FootNoteIcon from '@/public/footnote.svg';
import NotificationWarningIcon from '@/public/notificationYellow.svg';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import NotificationIcon from '@/public/notification.svg';
import QuestionIcon from '@/public/questionIcon.svg';
import { APP_PATHS } from '@/data/paths.data';
import { CartCellTitleItem } from './components/cell/CartCellTitleItem';
import { useDeepCompareEffect } from 'react-use';
import axios from 'axios';
import classNames from 'classnames';

type ColumnsType<T> = TableProps<T>['columns'];

export const useOrderFormation = () => {
  const router = useRouter();
  const {
    dataRequest,
    setDataRequest,
    loadingTableFormationData,
    setLoadingTableFormationData,
  } = useContext(RequestContext);
  const requestId = dataRequest.request?.id;
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IOrders | null>();
  const [isOpenModalReplacementProduct, setIsOpenModalReplacementProduct] =
    useState<boolean>(false);
  const [replacementProduct, setReplacementProduct] =
    useState<IReplacementProduct>();
  const [showOtherOffers, setShowOtherOffers] = useState<boolean>(false);
  const [isOpenModalProduct, setIsOpenModalProduct] = useState<boolean>(false);
  const [isOpenModalSupplyRequest, setIsOpenModalSupplyRequest] =
    useState<boolean>(false);

  const [selectedRows, setSelectedRows] = useState<ISelectedRows[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleViewMoreClick = () => {
    setShowOtherOffers(!showOtherOffers);
  };
  const searchParams = useSearchParams();
  const manufacturersQuery =
    searchParams.get('manufacturers')?.split('-') || [];
  const isOnlyInStockQuery = searchParams.get('isOnlyInStock') || 'false';
  const sellersQuery = searchParams.get('sellers')?.split('-') || [];
  const priceStartQuery = searchParams.get('price')?.split('-')[0] || undefined;
  const priceEndQuery = searchParams.get('price')?.split('-')[1] || undefined;
  const price = `&price=${`${priceStartQuery || ''}-${priceEndQuery || ''}`}`;
  const manufacturers = `&manufacturers=${manufacturersQuery || ''}`;
  const onlyInStock = isOnlyInStockQuery !== 'false' && `&onlyInStock=true`;
  const sellers = `&sellers=${sellersQuery || ''}`;

  const payload = {
    id: requestId,
    price,
    manufacturers,
    sellers,
    onlyInStock,
  };

  useDeepCompareEffect(() => {
    if (requestId) {
      const fetchOrders = async () => {
        try {
          setLoadingTableFormationData(true);

          const { data } = await APIRequest.get(
            API_ENDPOINTS.GET_FILTER_REQUEST(payload),
          );

          setDataRequest(prevState => {
            return {
              ...prevState,
              request: {
                ...prevState.request,
                order: data.request.order,
              },
            };
          });
        } catch (error) {
          if (axios.isAxiosError(error) && error.message) {
            notify('error', {
              message: error.message,
            });
          }
        } finally {
          setLoadingTableFormationData(false);
        }
      };
      fetchOrders();
    }
  }, [
    requestId,
    manufacturersQuery,
    sellersQuery,
    priceStartQuery,
    priceEndQuery,
    isOnlyInStockQuery,
  ]);

  const isInformationRequestRequired = dataRequest.request?.order?.some(
    item => {
      return (
        !item.originalProduct.optionsCount &&
        !item.originalProduct.productOffersCount
      );
    },
  );
  const [hideInformationRequired, setHideInformationRequired] =
    useState<boolean>(isInformationRequestRequired || false);

  useEffect(() => {
    if (isInformationRequestRequired) {
      setHideInformationRequired(isInformationRequestRequired);
    }
  }, [isInformationRequestRequired]);

  // Запрос данных для selected и rows
  const fetchExpandedData = async (requestId: number, positionId: number) => {
    setLoadingTableFormationData(true);
    const position = `&positionId=${positionId}`;
    const payload = {
      id: requestId,
      position,
    };
    try {
      const { data } = await APIRequest.get<IOrders>(
        API_ENDPOINTS.GET_FILTER_REQUEST(payload),
      );
      setSelectedProduct(data);
      setDataRequest(prevRequest => {
        const updatedOrders = prevRequest.request?.order?.map(order => {
          if (order.id === data.id) {
            return { ...order, ...data };
          }
          return order;
        });

        return {
          ...prevRequest,
          request: {
            ...prevRequest.request,
            order: updatedOrders,
          },
        };
      });
    } catch (error) {
      console.error('Ошибка получения данных:', error);
    } finally {
      setLoadingTableFormationData(false);
    }
  };

  // Клик на раскрытие selected и rows
  const handleExpand = async (expanded: boolean, record: IOrders) => {
    if (
      expanded &&
      (record.originalProduct.optionsCount > 0 ||
        record.originalProduct.productOffersCount > 0)
    ) {
      if (dataRequest.request?.id) {
        await fetchExpandedData(dataRequest.request?.id, record.id);
      }
      setExpandedRows([record.id]);
    } else {
      setSelectedProduct(null);
      setExpandedRows([]);
    }
  };

  // Возврат на вкладку 'addition'
  const pageAdditionalProducts = () => {
    if (dataRequest.request?.id) {
      router.push(
        APP_PATHS.REQUESTS_VIEW(dataRequest.request?.id) +
          '?' +
          new URLSearchParams({
            tab: 'addition',
          }).toString(),
      );
    }
  };

  // Переход на вкладку 'placing'
  const handleNextTabPlacing = async () => {
    const requestId = dataRequest?.request?.id;
    if (requestId) {
      router.push(
        APP_PATHS.REQUESTS_VIEW(requestId) +
          '?' +
          new URLSearchParams({
            tab: 'placing',
          }).toString(),
      );
    }
  };

  // Изменения количества товара в корзине
  const updateQuantity = async ({
    orderId,
    positionId,
    offerId,
    quantity,
  }: ICartQuantity): Promise<boolean> => {
    const requestBody = {
      orderId,
      offerId,
      positionId,
      quantity,
    };

    try {
      await APIRequest.post(API_ENDPOINTS.REQUEST_CART, requestBody);
      setDataRequest(prevData => {
        const newData = { ...prevData };

        const order = newData.request?.order?.find(o => o.id === positionId);
        if (order) {
          const selectedItem = order.selected.find(
            item => item.offerId === offerId,
          );
          if (selectedItem) {
            selectedItem.selectedAmount = quantity;
          }

          const newTotalProductsCart = order.selected.reduce(
            (sum, item) =>
              item.offerId !== offerId ? sum + item.selectedAmount : sum,
            0,
          );

          if (selectedItem) {
            order.originalProduct.totalProductsCart =
              newTotalProductsCart + selectedItem.selectedAmount;
          }
        }

        return newData;
      });

      return true;
    } catch (error) {
      console.error('Ошибка при изменении количества товара в корзине:', error);
      return false;
    }
  };

  // Открытие модального окна о товаре
  const openReplacementProductModal = (value: /*IOrders | ISelected */ any) => {
    if (value.titleItem) {
      const { name, partNumberId, productId } = value.titleItem;
      setReplacementProduct({
        name: name,
        partNumberId: partNumberId,
        productId: productId,
      });
    } else {
      const { productName, partNumberId, productId } = value;
      setReplacementProduct({
        name: productName,
        partNumberId: partNumberId,
        productId: productId,
      });
    }
    setIsOpenModalReplacementProduct(true);
  };
  // Работа с checkbox
  const handleRowSelectionChange = (
    selectedRecords: IOrders[],
    requestId: number,
  ) => {
    if (!selectedRecords.length) {
      setSelectedRows([]);
      setSelectedRowKeys([]);
      return;
    }

    const unifiedRows: ISelectedRows[] = selectedRecords.map(item => ({
      requestId,
      name: item.titleItem.name || item.originalProduct.name || null,
      partNumber:
        item.titleItem.partNumber ||
        item.originalProduct.requiredPartNumbers ||
        null,
      amount: item.originalProduct.amount,
      positionId: item.id,
    }));
    setSelectedRows(unifiedRows);
    setSelectedRowKeys(selectedRecords.map(record => record.id));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[], selectedRecords: IOrders[]) => {
      if (requestId) {
        setSelectedRowKeys(newSelectedRowKeys);
        handleRowSelectionChange(selectedRecords, requestId);
      }
    },
  };

  const resetSelection = () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
  };

  // колонки для главной таблицы
  const columns: ColumnsType<IOrders> = [
    {
      title: '№',
      dataIndex: 'id',
      key: '№',
      align: 'center',
      className: styles.rowKey,
    },
    {
      title: <span className={styles.titleCol}>Наименование</span>,
      dataIndex: 'name',
      key: 'name',
      className: styles.tableNameCol,
      render: (_, record) => {
        const { name, productId } = record.titleItem;
        const {
          productOffersCount,
          name: originalName,
          isPrefabricatedItem,
        } = record.originalProduct;

        return (
          <div>
            {!!name ? (
              <>
                <div className={styles.nameCell}>
                  {isPrefabricatedItem || !productId ? (
                    <div>{name}</div>
                  ) : (
                    <div
                      className={styles.nameProduct}
                      onClick={() => openReplacementProductModal(record)}
                    >
                      {name}
                    </div>
                  )}

                  {!!productOffersCount && (
                    <Tooltip title="Количество альтернативных позиций.">
                      <div className={styles.optionCount}>
                        + {productOffersCount}
                      </div>
                    </Tooltip>
                  )}
                </div>
                <div className={styles.neutralColor}>
                  <FootNoteIcon />
                  {originalName}
                </div>
              </>
            ) : (
              <div className={styles.nameCell}>
                {originalName}
                {!!productOffersCount && (
                  <Tooltip title="Количество альтернативных позиций.">
                    <div className={styles.optionCount}>
                      + {productOffersCount}
                    </div>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: <span className={styles.titleCol}>Каталожный номер</span>,
      dataIndex: 'partNumber',
      key: '4',
      className: styles.partNumberCell,
      render: (_, record) => {
        const { partNumber } = record.titleItem;
        const { requiredPartNumbers, isPrefabricatedItem } =
          record.originalProduct;
        if (isPrefabricatedItem) {
          return { props: { colSpan: 0 } };
        }
        return (
          <>
            {partNumber !== null ? (
              <div className={styles.partNumber}>
                <span>{partNumber}</span>
              </div>
            ) : (
              <div className={styles.partNumber}>{requiredPartNumbers}</div>
            )}
          </>
        );
      },
    },
    {
      title: <span className={styles.titleCol}>Производитель</span>,
      dataIndex: 'manufacture',
      key: 'manufacture',
      className: styles.manufactureCell,
      render: (_, record) => {
        const { isPrefabricatedItem, optionsCount, productOffersCount } =
          record.originalProduct;
        const { manufacturer } = record.titleItem;

        if (isPrefabricatedItem) {
          return {
            children: (
              <div className={styles.mergedCellMessage}>
                <NotificationWarningIcon />
                Сборная позиция. Разверните позицию и выберите поставщиков из
                списка.
              </div>
            ),
            props: {
              colSpan: 4,
            },
          };
        }
        if (!optionsCount && !productOffersCount) {
          return {
            children: (
              <div className={styles.mergedCellMessage}>
                <QuestionIcon />
                Требуется сделать запрос в снабжение.
              </div>
            ),
            props: {
              colSpan: 4, // Объединяем три колонки
            },
          };
        }
        if (!optionsCount) {
          return {
            children: (
              <div className={styles.mergedCellMessage}>
                <NotificationWarningIcon />
                Попробуйте отредактировать наименование или сделайте запрос в
                снабжение
              </div>
            ),
            props: {
              colSpan: 4, // Объединяем три колонки
            },
          };
        }
        return (
          <Link href="/" className={styles.link}>
            {manufacturer}
          </Link>
        );
      },
    },
    {
      title: <span className={styles.titleCol}>Поставщик</span>,
      dataIndex: 'provider',
      key: 'provider',
      className: styles.providerCell,
      render: (_, record) => {
        const { isPrefabricatedItem, optionsCount } = record.originalProduct;
        const { seller, relevance } = record.titleItem;

        if (isPrefabricatedItem) {
          return { props: { colSpan: 0 } };
        }
        if (!optionsCount) {
          return { props: { colSpan: 0 } };
        }
        return (
          <>
            <Link href="/" className={styles.link}>
              {seller}
            </Link>
            {relevance && (
              <div className={styles.relevance}>
                <span>Обновление:</span>
                <span>{formatDate({ dateString: relevance })}</span>
              </div>
            )}
          </>
        );
      },
    },
    {
      title: <span className={styles.titleCol}>Склад</span>,
      dataIndex: 'stock',
      key: 'stock',
      className: styles.stockCell,
      render: (_, record) => {
        const { isPrefabricatedItem, optionsCount, changeParameter } =
          record.originalProduct;
        const { warehouseName, totalAmount } = record.titleItem;

        if (isPrefabricatedItem) {
          return { props: { colSpan: 0 } }; // Скрываем ячейку
        }
        if (!optionsCount) {
          return { props: { colSpan: 0 } }; // Скрываем ячейку
        }
        return (
          <>
            <div className={styles.warehouseName}>
              <span>{warehouseName}</span>
              {(changeParameter === 1 || changeParameter === 3) && (
                <Tooltip title="С момента сохранения заявки, наличие товара изменилось">
                  <NotificationIcon />
                </Tooltip>
              )}
            </div>
            <div className={styles.neutralText}>
              {totalAmount && `${thousandsSeparator(totalAmount)} шт`}
            </div>
          </>
        );
      },
    },
    {
      title: <span className={styles.titleCol}>Цена, шт</span>,
      dataIndex: 'price',
      key: 'price',
      className: styles.priceCell,
      render: (_, record) => {
        const { optionsCount, averagePrice, vat, changeParameter } =
          record.originalProduct;

        if (!optionsCount) {
          return { props: { colSpan: 0 } }; // Скрываем ячейку
        }
        return (
          <div className={styles.price}>
            <div className={styles.summ}>
              <span>{formatPrice(averagePrice)} &#8381;</span>
              {(changeParameter === 2 || changeParameter === 3) && (
                <Tooltip title="С момента сохранения заявки, цена изменилась">
                  <NotificationIcon />
                </Tooltip>
              )}
            </div>
            <div className={styles.neutralText}>
              {vat ? 'с НДС' : 'без НДС'}
            </div>
          </div>
        );
      },
    },
    {
      title: <span className={styles.titleCol}>В заявке, шт</span>,
      dataIndex: 'applicationPcs',
      key: 'applicationPcs',
      className: styles.applicationPcsCel,
      render: (_, record) => (
        <div className={styles.applicationPcs}>
          {record.originalProduct.amount}
        </div>
      ),
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      className: styles.actionsCell,
      render: (_, record) => {
        return (
          <>
            {requestId && (
              <CartCellTitleItem
                record={record}
                requestId={requestId}
                updateQuantity={updateQuantity}
                openReplacementProductModal={openReplacementProductModal}
              />
            )}
          </>
        );
      },
    },
  ];

  return {
    router,
    dataRequest,
    loadingTableFormationData,
    requestId,
    expandedRows,
    selectedProduct,
    setSelectedProduct,
    isOpenModalReplacementProduct,
    setIsOpenModalReplacementProduct,
    replacementProduct,
    showOtherOffers,
    setShowOtherOffers,
    handleViewMoreClick,
    hideInformationRequired,
    setHideInformationRequired,
    handleExpand,
    pageAdditionalProducts,
    updateQuantity,
    openReplacementProductModal,
    rowSelection,
    columns,
    handleNextTabPlacing,
    isOpenModalProduct,
    setIsOpenModalProduct,
    isOpenModalSupplyRequest,
    setIsOpenModalSupplyRequest,
    selectedRows,
    resetSelection,
  };
};
