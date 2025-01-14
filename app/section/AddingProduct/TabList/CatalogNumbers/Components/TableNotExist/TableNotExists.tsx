import styles from './tableNotExists.module.css';
import { Select, Table, TableProps } from 'antd';
import PlusIcon from '@/public/plus.svg';
import { ColumnProps } from 'antd/es/table';
import Progress from '../../../../../../components/ProgressIcon/Progress';
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import {
  IDataTableNotPartNumbers,
  INotExist,
  IPropertyValuesComb,
  ITableData,
} from '@/interface/addingProduct/partNumbers.interface';
import { DropdownCellNotExist } from './DropDownNotExist';
import classNames from 'classnames';
import { getPopupContainer } from '@/data/utils.common';
import { Title } from '@/app/components/Title/Title';

type ColumnsType<T> = TableProps<T>['columns'];
const MAX_WIDTH_PROPERTY_COL_PERCENT = 76;

interface IProps {
  setDataNotPartNumber: Dispatch<
    SetStateAction<IPropertyValuesComb | undefined>
  >;
}

export function TableNotExist({
  setDataNotPartNumber,
}: IProps): React.ReactElement {
  const { dataProduct } = useContext(ProductContext);
  const [selectRowTable, setSelectRowTable] = useState<ITableData>();
  const [dataNotExist, setDataNotExist] = useState<INotExist>();

  const fetchNotExist = async () => {
    try {
      const response = await APIRequest.get(
        API_ENDPOINTS.GET_NOT_EXIST(dataProduct.product.id),
      );
      console.log('fetchNotExist', response);
      setDataNotExist(response.data);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  useEffect(() => {
    fetchNotExist();
  }, []);

  const defaultValueData: { [key: string]: string }[] | undefined =
    dataNotExist?.data?.map(propertySet => {
      const defaultValueSet: { [key: string]: string } = {};
      propertySet.notExistPropertyValues?.forEach(property => {
        defaultValueSet[`propertyProductId_${property.propertyProductId}`] =
          property.value;
      });
      return defaultValueSet;
    });

  const dataTableNotPartNumbers: IDataTableNotPartNumbers[] = [];
  dataNotExist?.data?.forEach(p => {
    const newPartNumber: IDataTableNotPartNumbers = {
      fillingProgress: 'error',
      partnumber: 'Не указано',
      properties: dataProduct.properties!,
      combinationId: p.notExistId,
    };

    dataTableNotPartNumbers.push(newPartNumber);
  });

  const propertiesColumns: ColumnProps<ITableData>[] = [];
  const widthProperties = dataProduct.properties!.length + 1;

  dataProduct.properties?.map((characteristic, index) => {
    const column: ColumnProps<ITableData> = {
      title: characteristic.property.name,
      dataIndex: `characteristic_${index}`,
      key: `characteristic_${index}`,
      render: (value, row, rowIndex) => {
        return (
          <Select
            getPopupContainer={getPopupContainer}
            defaultValue={
              defaultValueData && defaultValueData[rowIndex]
                ? defaultValueData[rowIndex][
                    `propertyProductId_${characteristic.propertyProductId}`
                  ]
                : ''
            }
            placeholder="Не указано"
            // variant="borderless"
            className={classNames([styles.select, 'borderless'])}
            options={characteristic?.propertyValues?.map((item, index) => ({
              key: `${item.value}_${index}`,
              value: item.value,
              label: item.value,
            }))}
          />
        );
      },
      width: `${MAX_WIDTH_PROPERTY_COL_PERCENT / widthProperties}%`,
    };
    propertiesColumns.push(column);
  });
  const handleRowClick = (record: ITableData) => {
    console.log('record', record);
    setSelectRowTable(record);
  };

  const columns: ColumnsType<ITableData> = [
    {
      align: 'center',
      title: '',
      dataIndex: 'fillingProgress',
      key: '1',
      render: (fillingProgress: string) => {
        return <Progress status={fillingProgress} />;
      },
      width: '4%',
    },

    {
      title: 'Каталожный номер',
      dataIndex: 'partnumber',
      key: '2',
      render: (partnumber: string) => (
        <span className={styles.partnumber}>{partnumber}</span>
      ),
      width: '16%',
    },
    ...propertiesColumns,
    {
      align: 'center',
      title: (
        <div className={styles.interactionTableCell}>
          <PlusIcon />
        </div>
      ),
      dataIndex: '',
      key: 'x',
      render: () => (
        <DropdownCellNotExist
          selectRowTable={selectRowTable}
          setDataNotPartNumber={setDataNotPartNumber}
          fetchNotExist={fetchNotExist}
        />
      ),
      width: '4%',
    },
  ];

  const tableData = dataTableNotPartNumbers?.map((item, index) => {
    const rowData: any = { ...item };
    return { ...rowData, key: index };
  });
  return (
    <div className={styles.container}>
      {!!tableData.length ? (
        <Table
          size="small"
          showSorterTooltip={false}
          columns={columns}
          rowKey={record => record.key}
          dataSource={tableData}
          pagination={false}
          bordered
          onRow={record => ({
            onClick: () => handleRowClick(record),
          })}
        />
      ) : (
        <Title tag="h2" className={styles.notDataTable}>
          Нет несуществующих деталей
        </Title>
      )}
    </div>
  );
}
