import { Button, Table, TableColumnsType, Tooltip } from 'antd';
import styles from './orderFormation.module.css';
import classNames from 'classnames';
import {
  formatDate,
  formatPrice,
  thousandsSeparator,
} from '@/data/utils.common';
import Link from 'next/link';
import ArrowDownIcon from '@/public/arrow-down.svg';
import {
  ICartQuantity,
  IOrders,
  ISelected,
} from '@/interface/request/request.interface';
import NotificationIcon from '@/public/notification.svg';
import { CartCellSelected } from './components/cell/CartCellSelected';
import { Dispatch, SetStateAction } from 'react';

interface IProps {
  selectedProduct: IOrders | null | undefined;
  requestId: number | undefined;
  setSelectedProduct: Dispatch<SetStateAction<IOrders | null | undefined>>;
  showOtherOffers: boolean;
  setShowOtherOffers: Dispatch<SetStateAction<boolean>>;
  handleViewMoreClick: () => void;
  updateQuantity: ({
    orderId,
    positionId,
    offerId,
    quantity,
  }: ICartQuantity) => Promise<boolean>;
  openReplacementProductModal: (value: any) => void;
}

export const expandedRowRender = ({
  selectedProduct,
  requestId,
  setSelectedProduct,
  showOtherOffers,
  setShowOtherOffers,
  handleViewMoreClick,
  updateQuantity,
  openReplacementProductModal,
}: IProps) => {
  if (!selectedProduct?.selected) return null;

  const expandedColumns: TableColumnsType<ISelected> = [
    {
      key: '№11',
      align: 'center',
      className: styles.rowKeyExp,
    },
    {
      key: 'analog',
      className: styles.tableNameColExp,
      render: (_, record) => {
        const { productName, productId } = record;

        return (
          <>
            {!productId ? (
              <div>{productName}</div>
            ) : (
              <div
                className={styles.nameProduct}
                onClick={() => openReplacementProductModal(record)}
              >
                {productName}
              </div>
            )}
          </>
        );
      },
    },
    {
      key: 'partNumber',
      className: styles.partNumberCellExp,
      render: (_, record) => {
        const { partNumber } = record;
        return <div className={styles.partNumber}>{partNumber}</div>;
      },
    },
    {
      key: 'manufacture',
      className: styles.manufactureCellExp,
      render: (_, record) => (
        <Link href="/" className={styles.link}>
          {record.manufacturer}
        </Link>
      ),
    },
    {
      key: 'provider',
      className: styles.providerCellExp,
      render: (_, record) => {
        const { sellerName, relevance } = record;
        return (
          <div>
            <Link href="/" className={styles.link}>
              {sellerName}
            </Link>
            {relevance && (
              <div className={styles.relevance}>
                <span>Обновление:</span>
                <span>{formatDate({ dateString: relevance })}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'stock',
      render: (_, record) => {
        const { warehouseName, productAmount, changeParameter } = record;
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
              {productAmount
                ? `${thousandsSeparator(productAmount)} шт`
                : 'Под заказ'}
            </div>
          </>
        );
      },
      className: styles.stockCellExp,
    },
    {
      key: 'price',
      className: styles.priceCellExp,
      render: (_, record) => {
        const { price, vat, changeParameter } = record;

        return (
          <div className={styles.price}>
            <div className={styles.summ}>
              <span>{formatPrice(price)} &#8381; </span>
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
      key: 'applicationPcs',
      className: styles.applicationPcsCelExp,
      align: 'end',
      render: () => {
        return <div className={styles.hideCartButton}>-</div>;
      },
    },
    {
      key: 'xx1',
      render: (_, record) => {
        return (
          <>
            {requestId && (
              <CartCellSelected
                setShowOtherOffers={setShowOtherOffers}
                setSelectedProduct={setSelectedProduct}
                updateQuantity={updateQuantity}
                record={record}
                openReplacementProductModal={openReplacementProductModal}
                requestId={requestId}
              />
            )}
          </>
        );
      },
    },
  ];
  const rowsProductLength = selectedProduct?.rows?.length;

  return (
    <>
      {selectedProduct.selected.length > 1 ? (
        <>
          <Table
            rowKey={record => record.id}
            columns={expandedColumns}
            dataSource={selectedProduct?.selected}
            pagination={false}
            bordered
            className={classNames(
              [styles.tableSelected, 'table-selected', 'table-bordered'],
              {
                'table-expanded': rowsProductLength > 0,
              },
            )}
          />
          {rowsProductLength > 0 && (
            <div className={styles.tableRowsButton}>
              <Button
                className={classNames([
                  styles.viewRowsTable,
                  'button-transparent',
                  {
                    [styles.openTable]: showOtherOffers,
                  },
                ])}
                onClick={handleViewMoreClick}
              >
                Смотреть другие предложения ( {rowsProductLength} )
                <ArrowDownIcon />
              </Button>
            </div>
          )}
          {showOtherOffers && (
            <Table
              rowKey={record => record.id}
              columns={expandedColumns}
              dataSource={selectedProduct.rows}
              pagination={false}
              bordered
              className={classNames(
                [styles.tableRows, 'table-rows', 'table-bordered'],
                {
                  'table-expanded': showOtherOffers,
                },
              )}
            />
          )}
        </>
      ) : (
        <>
          <Table
            rowKey={record => record.id}
            columns={expandedColumns}
            dataSource={selectedProduct.rows}
            pagination={false}
            bordered
            className={classNames([
              styles.tableRows,
              'table-rows',
              'table-bordered',
            ])}
          />
        </>
      )}
    </>
  );
};
