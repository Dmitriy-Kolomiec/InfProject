import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Table } from 'antd';
import styles from './TableAddPositions.module.css';
import { IProductList } from '@/interface/request/request.interface';
import classNames from 'classnames';
import { useTableAddPositions } from './useTableAddPositions';

interface IProps {
  selectedRowKeys: IProductList[];
  setSelectedRowKeys: Dispatch<SetStateAction<any[]>>;
}

export default function TableAddPositions({
  selectedRowKeys,
  setSelectedRowKeys,
}: IProps): React.ReactElement {
  const { DOCUMENT_DATA, rowSelection, columns, addDataTableToLocalStorage } =
    useTableAddPositions({
      selectedRowKeys,
      setSelectedRowKeys,
    });

  useEffect(() => {
    if (DOCUMENT_DATA) {
      addDataTableToLocalStorage(DOCUMENT_DATA, 'request');
    }
  }, [DOCUMENT_DATA]);

  return (
    <Table
      className={classNames([styles.table, 'table-notPartnumbers'])}
      rowKey={record => record.id}
      size="middle"
      showSorterTooltip={false}
      columns={columns}
      dataSource={DOCUMENT_DATA}
      pagination={false}
      bordered
      rowSelection={rowSelection}
    />
  );
}
