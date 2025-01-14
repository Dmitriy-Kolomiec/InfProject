import { Table } from 'antd';
import styles from './tablePartNumbers.module.css';
import { IPublicPartNumber } from '@/interface/publicPart/publicPart.interface';
import { useTablePartNumbers } from './useTablePartNumbers.hook';

interface IProps {
  dataTable: IPublicPartNumber[] | undefined;
  mainProduct: {
    name: string;
    id: number;
  };
}

export const TablePartNumbers = ({ dataTable, mainProduct }: IProps) => {
  const { columns } = useTablePartNumbers({ mainProduct });

  return (
    <>
      {!!dataTable && (
        <Table
          pagination={false}
          size="small"
          showSorterTooltip={false}
          columns={columns}
          rowKey={record => `${record.partNumber.id}`}
          dataSource={dataTable}
          bordered
          className={styles.table}
        />
      )}
    </>
  );
};
