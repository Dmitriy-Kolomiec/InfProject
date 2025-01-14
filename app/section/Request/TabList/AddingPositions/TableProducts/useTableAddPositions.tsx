import React, { Dispatch, SetStateAction, useContext } from 'react';
import { Button, TableProps, Tooltip } from 'antd';
import styles from './TableAddPositions.module.css';
import DeleteIcon from '@/public/deleteBgBlack.svg';
import QuantityCounter from '@/app/components/Counter/QuantityCounter';
import { EditableCell } from './components/EditableCell';
import { IProductList } from '@/interface/request/request.interface';
import { getPopupContainer } from '@/data/utils.common';
import { RequestContext } from '@/context/Request/request.context';

type ColumnsType<T> = TableProps<T>['columns'];

interface IProps {
  selectedRowKeys: IProductList[];
  setSelectedRowKeys: Dispatch<SetStateAction<any[]>>;
}

export const useTableAddPositions = ({
  selectedRowKeys,
  setSelectedRowKeys,
}: IProps) => {
  const { dataRequest, setDataRequest } = useContext(RequestContext);
  const DOCUMENT_DATA = dataRequest.request?.document;

  const updateQuantity = (id: number, newQuantity: number) => {
    setDataRequest(prevRequest => {
      const updatedDocument =
        prevRequest.request?.document?.map(item =>
          item.id === id ? { ...item, amount: newQuantity } : item,
        ) || [];

      return {
        ...prevRequest,
        request: {
          ...prevRequest.request,
          document: updatedDocument,
        },
      };
    });
  };

  const onSelectChange = (selectedKeys: React.Key[], selectedRows: any[]) => {
    setSelectedRowKeys(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys.map(row => row.id),
    onChange: onSelectChange,
  };

  const updateItem = (id: number, newValues: any) => {
    setDataRequest(prevRequest => {
      const updatedDocument =
        prevRequest.request?.document?.map(item =>
          item.id === id ? { ...item, ...newValues } : item,
        ) || [];

      return {
        ...prevRequest,
        request: {
          ...prevRequest.request,
          document: updatedDocument,
        },
      };
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: '2',
      width: '50%',
      render: (name, record) => {
        return (
          <EditableCell
            value={name}
            onSave={newValue => updateItem(record.id, { name: newValue })}
          />
        );
      },
    },
    {
      title: 'Каталожный номер',
      dataIndex: 'partNumbers',
      key: '3',
      width: '30%',
      render: (partNumbers, record) => {
        const partNumbersString = partNumbers.join(', ');
        return (
          <EditableCell
            value={partNumbersString}
            onSave={newValue =>
              updateItem(record.id, { partNumbers: newValue.split(', ') })
            }
          />
        );
      },
    },
    {
      title: 'Количество',
      dataIndex: 'amount',
      key: '3',
      width: '13%',
      render: (amount, record) => {
        return (
          <QuantityCounter
            count={amount}
            setCount={(newCount: number) => updateQuantity(record.id, newCount)}
          />
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '4%',
      render: (_, record) => {
        return (
          <div className={styles.buttonActions}>
            <Tooltip title="Удалить" getPopupContainer={getPopupContainer}>
              <Button
                className="button-transparent"
                onClick={() => deleteProduct(record.id)}
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const deleteProduct = (id: number) => {
    if (DOCUMENT_DATA) {
      setDataRequest(prevRequest => {
        const currentDocuments = prevRequest.request?.document || [];
        const updatedDocuments = currentDocuments.filter(
          (item: IProductList) => item.id !== id,
        );
        const updatedRequest = {
          ...prevRequest,
          request: {
            ...prevRequest.request,
            document: updatedDocuments,
          },
        };
        addDataTableToLocalStorage(updatedRequest.request.document, 'request');
        return updatedRequest;
      });
    }
  };

  return {
    dataRequest,
    DOCUMENT_DATA,
    rowSelection,
    columns,
    addDataTableToLocalStorage,
  };
};

export function addDataTableToLocalStorage<T>(products: T[], key: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const existingData = localStorage.getItem(key);
      let requestData = existingData ? JSON.parse(existingData) : {};

      if (key === 'request') {
        requestData = {
          ...requestData,
          document: products,
        };
      } else {
        requestData = products;
      }

      const stringState = JSON.stringify(requestData);
      localStorage.setItem(key, stringState);
    } catch (error) {
      console.error(error);
    }
  }
}
