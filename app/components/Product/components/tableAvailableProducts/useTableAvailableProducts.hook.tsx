import { TablePaginationConfig, TableProps } from 'antd';
import styles from './tableAvailableProducts.module.css';
import {
  formatDate,
  formatPrice,
  thousandsSeparator,
} from '@/data/utils.common';
import OriginalManufactureIcon from '@/public/originalManufacture.svg';
import { IAvailableProduct } from '../../product.interface';
import { useState } from 'react';

interface IProps {
  dataTable: IAvailableProduct[] | undefined;
}

type ColumnsType<T> = TableProps<T>['columns'];
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
}

export const useTableAvailableProducts = ({ dataTable }: IProps) => {
  const [paginatedData, setPaginatedData] = useState<IAvailableProduct[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      position: ['bottomCenter'],
      current: 1,
      pageSize: 10,
      className: `${styles.pagination}`,
    },
  });

  const handleTableChange: TableProps<any>['onChange'] = (
    pagination,
    filters,
    sorter,
  ) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  // Функция для обновления общего количества элементов
  const updatePaginationTotal = (total: number) => {
    setTableParams(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        total, // Обновляем общее количество записей
      },
    }));
  };

  const columns: ColumnsType<IAvailableProduct> = [
    {
      title: 'Каталожный номер',
      dataIndex: 'partnumber',
      key: 'partNumber',
      width: '20%',
    },
    {
      title: 'Производитель',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: '27%',
      render: (_, record) => (
        <div className={styles.manufacture}>
          <span>{record.manufacturer}</span>
          {record.manufacturer === 'Оригинал' && <OriginalManufactureIcon />}
        </div>
      ),
    },
    {
      title: 'Склад',
      dataIndex: 'stock',
      key: 'stock',
      width: '32%',
      render: (_, record) => {
        const { seller, warehouse, amount } = record;

        return (
          <div className={styles.stockCell}>
            <span>
              {seller}
              {warehouse && ` (${warehouse})`}
            </span>
            {!!amount ? (
              <span>{thousandsSeparator(amount)} шт</span>
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
      width: '14',
      render: (_, record) => {
        const { price, vat } = record;

        return (
          <div className={styles.price}>
            <div className={styles.summ}>{formatPrice(price)} &#8381;</div>
            <div className={styles.neutralText}>
              {!!vat ? 'с НДС' : 'без НДС'}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Актуальность',
      dataIndex: 'relevance',
      key: 'relevance',
      width: '10',
      render: (_, record) => {
        const { relevance } = record;
        return (
          <div className={styles.relevance}>
            {formatDate({
              dateString: relevance,
              isHours: false,
            })}
          </div>
        );
      },
    },
  ];

  return {
    paginatedData,
    setPaginatedData,
    tableParams,
    handleTableChange,
    columns,
    updatePaginationTotal,
  };
};
