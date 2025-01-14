import { Pagination, Select, Table } from 'antd';
import styles from './productsTable.module.css';
import { IPublicProducts } from '@/interface/publicPart/publicPart.interface';
import { useProductsTable } from './useProductsTable.hook';

interface IProps {
  productsList: IPublicProducts | null;
}

export const ProductsTable = ({ productsList }: IProps) => {
  const {
    page,
    pageSize,
    tableData,
    columns,
    handleChangeSelect,
    onChangePage,
  } = useProductsTable({ productsList });

  return (
    <>
      <Table
        className={styles.table}
        size="small"
        showSorterTooltip={false}
        rowKey={record => record.key}
        columns={columns}
        dataSource={tableData}
        pagination={false}
        bordered
      />
      <div className={styles.pagination}>
        <Pagination
          defaultCurrent={page}
          total={productsList?.amount}
          pageSize={pageSize}
          onChange={onChangePage}
        />
        {productsList && productsList.amount > 10 && (
          <div className={styles.select}>
            <span className={styles.labelSelect}>Отображать по</span>
            <Select
              getPopupContainer={triggerNode =>
                triggerNode.parentNode as HTMLElement
              }
              defaultValue="10"
              onChange={handleChangeSelect}
              popupMatchSelectWidth={60}
              options={[
                { value: '10', label: '10' },
                { value: '20', label: '20' },
                { value: '50', label: '50' },
                { value: '100', label: '100' },
              ]}
            />
          </div>
        )}
      </div>
    </>
  );
};
