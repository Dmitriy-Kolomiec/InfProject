import { Table } from 'antd';
import styles from './tableAvailableProducts.module.css';
import { IAvailableProduct } from '../../product.interface';
import { Title } from '@/app/components/Title/Title';
import { useTableAvailableProducts } from './useTableAvailableProducts.hook';
import { useEffect } from 'react';
import { useDeepCompareEffect } from 'react-use';

interface IProps {
  dataTable: IAvailableProduct[] | undefined;
}

export const TableAvailableProducts = ({ dataTable }: IProps) => {
  const {
    tableParams,
    handleTableChange,
    columns,
    paginatedData,
    setPaginatedData,
    updatePaginationTotal,
  } = useTableAvailableProducts({ dataTable });

  useDeepCompareEffect(() => {
    if (dataTable) {
      const current = tableParams.pagination?.current || 1;
      const pageSize = tableParams.pagination?.pageSize || 10;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      setPaginatedData(dataTable.slice(start, end));

      updatePaginationTotal(dataTable.length);
    }
  }, [dataTable, tableParams.pagination]);

  return (
    <div className={styles.container}>
      <Title tag="h2" className={styles.title}>
        Наличие у поставщиков
      </Title>
      {!!paginatedData && (
        <Table
          pagination={
            !!dataTable && dataTable.length > 10
              ? tableParams.pagination
              : false
          }
          size="small"
          showSorterTooltip={false}
          columns={columns}
          rowKey={record => `${record.partnumber}-${record.warehouse}`}
          dataSource={paginatedData}
          bordered
          className={styles.table}
          onChange={handleTableChange}
        />
      )}
    </div>
  );
};
