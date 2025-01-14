import styles from './tableNotPartnumbers.module.css';
import { Select, Spin, Table, TableProps } from 'antd';
import PlusIcon from '@/public/plus.svg';
import { ColumnProps, TablePaginationConfig } from 'antd/es/table';
import Progress from '../../../../../../components/ProgressIcon/Progress';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import {
  IDataTableNotPartNumbers,
  IPropertyValuesComb,
  ITableData,
} from '@/interface/addingProduct/partNumbers.interface';
import { DropdownCell } from './DropDown';
import classNames from 'classnames';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LoadingOutlined } from '@ant-design/icons';
import { getPopupContainer } from '@/data/utils.common';

type ColumnsType<T> = TableProps<T>['columns'];
const MAX_WIDTH_PROPERTY_COL_PERCENT = 76;

interface IProps {
  dataNotPartNumber?: IPropertyValuesComb;
  setDataNotPartNumber: Dispatch<
    SetStateAction<IPropertyValuesComb | undefined>
  >;
  page: string | null;
  isLoaderNotPartNumber: boolean;
}
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
}

export function TableNotPartnumbers({
  dataNotPartNumber,
  setDataNotPartNumber,
  page,
  isLoaderNotPartNumber,
}: IProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { dataProduct } = useContext(ProductContext);
  const [selectRowTable, setSelectRowTable] = useState<ITableData>();
  const [tableParams, setTableParams] = useState<TableParams>();

  useEffect(() => {
    if (dataNotPartNumber) {
      setTableParams({
        pagination: {
          position: ['bottomCenter'],
          current: Number(page),
          pageSize: 100,
          total: dataNotPartNumber?.amount,
        },
      });
    }
  }, [dataNotPartNumber]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleTableChange: TableProps<any>['onChange'] = pagination => {
    router.push(
      pathname + '?' + createQueryString('page', String(pagination.current)),
    );
    setTableParams({
      pagination,
    });
  };

  const defaultValueData: { [key: string]: string }[] | undefined =
    dataNotPartNumber?.data?.map(propertySet => {
      const defaultValueSet: { [key: string]: string } = {};
      propertySet.propertyValues.forEach(property => {
        defaultValueSet[`propertyProductId_${property.propertyProductId}`] =
          property.value;
      });
      return defaultValueSet;
    });

  const dataTableNotPartNumbers: IDataTableNotPartNumbers[] = [];
  dataNotPartNumber?.data?.forEach(p => {
    const newPartNumber: IDataTableNotPartNumbers = {
      fillingProgress: 'warning',
      partnumber: 'Не указано',
      properties: dataProduct.properties!,
      combinationId: p.combinationId,
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
    setSelectRowTable(record);
  };

  const columns: ColumnsType<ITableData> = [
    {
      align: 'center',
      title: '',
      dataIndex: 'fillingProgress',
      key: 'fillingProgress',
      render: (fillingProgress: string) => {
        return <Progress status={fillingProgress} />;
      },
      width: '4%',
    },
    {
      title: 'Каталожный номер',
      dataIndex: 'partnumber',
      key: 'partnumber',
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
      key: 'actions',
      render: () => (
        <DropdownCell
          dataNotPartNumber={dataNotPartNumber}
          selectRowTable={selectRowTable}
          setDataNotPartNumber={setDataNotPartNumber}
        />
      ),
      width: '4%',
    },
  ];

  const tableData = dataTableNotPartNumbers?.map((item, index) => {
    const rowData: any = { ...item };
    return { ...rowData, key: item.combinationId || index };
  });

  return (
    <div className={styles.container}>
      {isLoaderNotPartNumber ? (
        <div className={styles.loader}>
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : (
        <Table
          pagination={tableParams?.pagination}
          size="small"
          showSorterTooltip={false}
          columns={columns}
          rowKey={record => record.key}
          dataSource={tableData}
          bordered
          onRow={record => ({
            onClick: () => handleRowClick(record),
          })}
          onChange={handleTableChange}
          className="table-notPartnumbers"
        />
      )}
    </div>
  );
}
