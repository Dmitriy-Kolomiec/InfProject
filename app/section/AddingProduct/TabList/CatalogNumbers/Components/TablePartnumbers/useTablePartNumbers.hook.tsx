import styles from './tablePartnumbers.module.css';
import { Button, Dropdown, Form, Select, TableProps } from 'antd';
import classNames from 'classnames';
import PlusIcon from '@/public/plus.svg';
import InteractionIcon from '@/public/interaction.svg';
import { ColumnProps } from 'antd/es/table';
import Progress from '../../../../../../components/ProgressIcon/Progress';
import React, { useCallback, useContext, useState } from 'react';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { IProperties } from '@/interface/addingProduct/options.interface';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import {
  IDataTablePartNumbers,
  ITableData,
} from '@/interface/addingProduct/partNumbers.interface';
import { IAddPartNumber } from '@/interface/addingProduct/addPartNumber.interface';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { getPopupContainer, notify } from '@/data/utils.common';
import { tagRender } from './TagRender';

type ColumnsType<T> = TableProps<T>['columns'];
type ItemType = { key: string; label: JSX.Element; action: string };
const MAX_WIDTH_PROPERTY_COL_PERCENT = 76;

interface IProps {
  dataProductUpdate: () => Promise<void>;
  addCharacteristic: () => void;
}

export const useTablePartNumbers = ({
  dataProductUpdate,
  addCharacteristic,
}: IProps) => {
  const [isOpenModalDeleting, setIsOpenModalDeleting] =
    useState<boolean>(false);
  const [selectRowTable, setSelectRow] = useState<ITableData>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const { dataProduct, setDataProduct } = useContext(ProductContext);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab: string | null = searchParams.get('tab');
  const productId: string | null = searchParams.get('productId');
  const partNumberEditId: string | null = searchParams.get('partNumberEdit');
  const editPartNumber = dataProduct.partNumbers?.filter(
    item => item.partNumber.id === Number(partNumberEditId),
  );
  const [fileIdsDescription, setFileIdsDescription] = useState<number[]>([]);
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const onCloseDrawer = () => {
    const params = new URLSearchParams();
    if (activeTab !== null) {
      params.set('tab', activeTab);
    }
    if (productId !== null) {
      params.set('productId', productId);
    }
    router.push(pathname + '?' + params.toString());
    setOpenDrawer(false);
  };
  const showDrawer = () => {
    router.push(
      pathname +
        '?' +
        createQueryString('partNumberEdit', `${selectRowTable?.partNumberId}`),
    );
    setOpenDrawer(true);
  };

  const editFormPartnumber = () => {
    form.submit();
    onCloseDrawer();
  };

  const onSelectChange = async (
    partnumberId: string,
    characteristic: IProperties,
    value: string[],
    propertyProductId: number,
  ) => {
    const propertyValueIds = characteristic.propertyValues
      .map(property => {
        return value.find(item => property.value === item) ? property.id : null;
      })
      .filter(id => id !== null);

    const requestBody = {
      partNumberId: Number(partnumberId),
      propertyValueIds: propertyValueIds || null,
      propertyProductId: propertyProductId,
    };

    try {
      await APIRequest.post(
        API_ENDPOINTS.SET_PRODUCT_PROPERTY_VALUE,
        requestBody,
      );
      dataProductUpdate();
    } catch (error) {
      console.error('Ошибка добавлении value в Select:', error);
      if (axios.isAxiosError(error) && error.message) {
        notify('error', {
          message: error.message,
        });
      }
    }
  };

  const dataTablePartNumbers: IDataTablePartNumbers[] = [];
  dataProduct.partNumbers?.forEach((p, index) => {
    const newPartNumber: IDataTablePartNumbers = {
      partNumberId: p.partNumber.id.toString(),
      fillingProgress: '',
      partnumber: p.partNumber.partNumber,
      properties: dataProduct.properties!,
      defaultValuesSelect: [],
    };
    if (!p.propertyValues[0].id) {
      newPartNumber.fillingProgress = 'warning';
    } else {
      if (
        p.propertyValues?.length === newPartNumber.properties.length ||
        p.propertyValues?.length ===
          newPartNumber.properties[index]?.propertyValues.length
      ) {
        newPartNumber.fillingProgress = 'success';
      } else {
        newPartNumber.fillingProgress = 'warning';
      }
    }

    const partNumberPropertyProductIds = p.propertyValues?.map(
      propertyValue => propertyValue.id,
    );
    dataProduct.properties?.forEach(property => {
      const propertyIndex = newPartNumber.properties.findIndex(
        prop => prop.property.id === property.property.id,
      );
      if (propertyIndex !== -1) {
        const selectedPropertyValues = property.propertyValues.filter(
          propValue => partNumberPropertyProductIds?.includes(propValue.id),
        );

        // Теперь мы добавляем массив значений
        if (selectedPropertyValues.length > 0) {
          newPartNumber.defaultValuesSelect.push({
            [property.property.id]: selectedPropertyValues.map(
              val => val.value,
            ),
          });
        }
      }
    });
    dataTablePartNumbers.push(newPartNumber);
  });

  const propertiesColumns: ColumnProps<ITableData>[] = [];
  const propertiesData = dataTablePartNumbers[0]?.properties;
  const widthProperties = propertiesData?.length + 1;

  propertiesData?.forEach((characteristic, i) => {
    const column: ColumnProps<ITableData> = {
      title: characteristic.property.name,
      dataIndex: `characteristic_${i}`,
      key: `characteristic_${i}`,
      render: (_, record) => {
        return (
          <Select
            tagRender={tagRender}
            mode="multiple"
            tokenSeparators={[',']}
            getPopupContainer={getPopupContainer}
            defaultValue={
              record.defaultValuesSelect.find(item =>
                Object.prototype.hasOwnProperty.call(
                  item,
                  characteristic.property.id.toString(),
                ),
              )?.[characteristic.property.id.toString()] || []
            }
            onChange={(value: string[]) =>
              onSelectChange(
                record.partNumberId,
                characteristic,
                value,
                characteristic.propertyProductId,
              )
            }
            placeholder="Не указано"
            // variant="borderless"
            className={classNames([
              styles.select,
              'borderless',
              'multipleTags',
            ])}
            options={[
              { key: 'none', value: null, label: 'Не указано' },
              ...characteristic.propertyValues.map((item, index) => ({
                key: `${item.value}_${index}`,
                value: item.value,
                label: item.value,
              })),
            ]}
          />
        );
      },
      width: `${MAX_WIDTH_PROPERTY_COL_PERCENT / widthProperties}%`,
    };
    propertiesColumns.push(column);
  });

  const itemsCellInteraction: ItemType[] = [
    {
      key: '1',
      label: (
        <Button className="button-transparent" onClick={showDrawer}>
          Редактировать
        </Button>
      ),
      action: 'Редактировать',
    },
    {
      key: '2',
      label: (
        <Button
          onClick={() => setIsOpenModalDeleting(true)}
          className={classNames(['button-transparent', styles.buttonDropdown])}
        >
          Удалить
        </Button>
      ),
      action: 'Удалить',
    },
  ];

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
        <>
          {partnumber ? (
            <Button
              className={classNames([
                styles.buttonPartnumber,
                'button-transparent',
              ])}
            >
              {partnumber}
            </Button>
          ) : (
            <span className={styles.notIndicated}>Не указано</span>
          )}
        </>
      ),
      width: '16%',
    },
    ...propertiesColumns,
    {
      align: 'center',
      title: (
        <Button
          className={classNames([
            styles.interactionTableCell,
            'button-transparent',
          ])}
          onClick={addCharacteristic}
        >
          <PlusIcon />
        </Button>
      ),
      dataIndex: '',
      key: 'x',
      render: (row: ITableData) => (
        <Dropdown
          className={styles.dropdown}
          getPopupContainer={getPopupContainer}
          trigger={['click']}
          menu={{
            items: itemsCellInteraction.map(item => ({
              ...item,
            })),
          }}
        >
          <InteractionIcon />
        </Dropdown>
      ),
      width: '4%',
    },
  ];

  const tableData = dataTablePartNumbers.map((item, index) => {
    const rowData: any = { ...item };
    return rowData;
  });

  const onFinishEditPartnumbers = async (value: IAddPartNumber) => {
    setIsLoader(true);
    const productManufacturers = value.manufacturers?.map(item => ({
      manufacturerId: item.manufacturerId,
      experience: {
        rating: Number(item.rating),
        review: item.review,
      },
    }));
    const productAutoModels = value.autoModelsIds?.map(model => ({
      id: model.vehicleId,
      amount: Number(model.amount) || undefined,
      identifyMethod: model.identifyMethod,
      externalScheme: model.externalScheme,
    }));

    const requestBody = {
      partNumberId: Number(selectRowTable?.partNumberId),
      partNumber: value.partNumber,
      autoModels: productAutoModels,
      manufacturers: productManufacturers,
      fileIds: fileIdsDescription,
    };

    try {
      const { data } = await APIRequest.put(
        API_ENDPOINTS.EDIT_PRODUCT_PARTNUMBER,
        requestBody,
      );
      setDataProduct(state => ({
        ...state,
        partNumbers: data,
      }));
      form.resetFields();
      setIsLoader(false);
      onCloseDrawer();
    } catch (error) {
      console.error('Ошибка при редактирования каталожного номера:', error);
      if (axios.isAxiosError(error) && error.message) {
        setIsLoader(false);
        onCloseDrawer();
        notify('error', {
          message: error.message,
        });
      }
    }
  };
  const handleRowClick = (record: ITableData) => {
    setSelectRow(record);
  };

  return {
    isOpenModalDeleting,
    setIsOpenModalDeleting,
    selectRowTable,
    openDrawer,
    form,
    editPartNumber,
    onCloseDrawer,
    editFormPartnumber,
    tableData,
    onFinishEditPartnumbers,
    handleRowClick,
    columns,
    isLoader,
    setFileIdsDescription,
  };
};
