import { Button, Table, TableProps } from 'antd';
import styles from './tableOffers.module.css';
import { IOffers } from '@/interface/request/request.interface';
import {
  formatDate,
  formatPrice,
  thousandsSeparator,
} from '@/data/utils.common';
import classNames from 'classnames';
import ReplaceButton from '@/public/refresh.svg';
import { useState } from 'react';
import { CustomPagination } from '@/app/components/Pagination/Pagination';
interface IProps {
  dataTable: IOffers[];
}

type ColumnsType<T> = TableProps<T>['columns'];

export const TableOffers = ({ dataTable }: IProps) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const columns: ColumnsType<IOffers> = [
    {
      title: <span className={styles.titleCol}>№</span>,
      dataIndex: 'id',
      align: 'center',
      width: '3%',
      render: (_, record) => <span>{record.id + 1}</span>,
    },
    {
      title: <span className={styles.titleCol}>Наименование</span>,
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (_, record) => {
        const { productName } = record.offer;
        return <span>{productName}</span>;
      },
    },
    {
      title: <span className={styles.titleCol}>Каталожный номер</span>,
      dataIndex: 'partnumber',
      key: 'partNumber',
      width: '12%',
      render: (_, record) => {
        const { partNumber } = record.offer;
        return <span>{partNumber}</span>;
      },
    },
    {
      title: <span className={styles.titleCol}>Производитель</span>,
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: '12%',
      render: (_, record) => {
        const { manufacturer } = record.offer;
        return <span className={styles.link}>{manufacturer}</span>;
      },
    },
    {
      title: <span className={styles.titleCol}>Поставщик</span>,
      key: 'provider',
      width: '12%',
      className: styles.providerCellExp,
      render: (_, record) => {
        const { sellerName, relevance } = record.offer;
        return (
          <>
            {!!sellerName ? (
              <div>
                <div>
                  <span className={styles.link}>{sellerName}</span>
                </div>
                {relevance && (
                  <div className={styles.relevance}>
                    <span>Обновление:</span>
                    <span>{formatDate({ dateString: relevance })}</span>
                  </div>
                )}
              </div>
            ) : (
              <span>Не указано</span>
            )}
          </>
        );
      },
    },
    {
      title: <span className={styles.titleCol}>Склад</span>,
      dataIndex: 'stock',
      key: 'stock',
      width: '12%',
      render: (_, record) => {
        const { warehouseName, productAmount } = record.offer;

        return (
          <div className={styles.stockCell}>
            {!!warehouseName ? (
              <>
                <span>{warehouseName}</span>
                {!!productAmount ? (
                  <span className={styles.neutralColor}>
                    {thousandsSeparator(productAmount)} шт
                  </span>
                ) : (
                  <span>Под заказ</span>
                )}
              </>
            ) : (
              <span>Не указано</span>
            )}
          </div>
        );
      },
    },
    {
      title: <span className={styles.titleCol}>Цена, шт</span>,
      dataIndex: 'price',
      key: 'price',
      width: '7%',
      render: (_, record) => {
        const { price, vat } = record.offer;

        return (
          <>
            {price ? (
              <div className={styles.price}>
                <div className={styles.summ}>{formatPrice(price)} &#8381;</div>
                <div className={styles.neutralText}>
                  {!!vat ? 'с НДС' : 'без НДС'}
                </div>
              </div>
            ) : (
              <span className={styles.price}>Не указано</span>
            )}
          </>
        );
      },
    },
    {
      title: <span className={styles.titleCol}>В заявке, шт</span>,
      dataIndex: 'applicationPcs',
      key: 'applicationPcs',
      width: '7%',
      render: (_, record) => {
        const { selectedAmount } = record.offer;
        return (
          <div className={styles.applicationPcs}>
            {!!selectedAmount ? (
              <span>{record.offer.selectedAmount}</span>
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '13%',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <Button
              className={classNames(['button-primary', styles.replaceButton])}
            >
              Заменить
              <ReplaceButton />
            </Button>
          </>
        );
      },
    },
  ];

  const handleChangeSelect = (value: string) => {
    setPage(1);
    setPageSize(Number(value));
  };

  const onChangePagination = (value: number) => {
    setPage(value);
  };

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = dataTable.slice(startIndex, endIndex);

  return (
    <div>
      <Table
        pagination={false}
        size="small"
        showSorterTooltip={false}
        columns={columns}
        rowKey={record => `${record.id}-${record.offer.partNumberId}`}
        dataSource={paginatedData}
        bordered
        className={styles.table}
      />
      {dataTable && dataTable.length > 10 && (
        <CustomPagination<IOffers>
          data={dataTable}
          page={page}
          pageSize={pageSize}
          onChange={onChangePagination}
          onChangeSelect={handleChangeSelect}
        />
      )}
    </div>
  );
};
