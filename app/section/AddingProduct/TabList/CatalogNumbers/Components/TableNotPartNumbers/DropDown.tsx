import {
  IPropertyValuesComb,
  ITableData,
} from '@/interface/addingProduct/partNumbers.interface';
import { DropdownProps, Switch, Dropdown } from 'antd';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import InteractionIcon from '@/public/interaction.svg';
import classNames from 'classnames';
import styles from './tableNotPartnumbers.module.css';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { getPopupContainer } from '@/data/utils.common';

type ItemType = { key: string; label: JSX.Element; action: string };

interface IProps {
  dataNotPartNumber?: IPropertyValuesComb;
  selectRowTable?: ITableData;
  setDataNotPartNumber: Dispatch<
    SetStateAction<IPropertyValuesComb | undefined>
  >;
}

export const DropdownCell = ({
  dataNotPartNumber,
  selectRowTable,
  setDataNotPartNumber,
}: IProps) => {
  const [open, setOpen] = useState(false);
  const { dataProduct } = useContext(ProductContext);
  const handleOpenChange: DropdownProps['onOpenChange'] = (nextOpen, info) => {
    if (info.source === 'trigger' || nextOpen) {
      setOpen(nextOpen);
    }
  };

  const addNotExistPart = async (checked: boolean) => {
    const requestValues = dataNotPartNumber?.data
      .filter(item => item.combinationId === selectRowTable?.combinationId)[0]
      .propertyValues.map(id => ({ id: id.propertyValueId }));
    const requestBody = {
      productId: dataProduct.product.id,
      propertyValues: requestValues,
    };
    if (checked) {
      try {
        const response = await APIRequest.post(
          API_ENDPOINTS.SET_NOT_EXIST,
          requestBody,
        );
        setDataNotPartNumber(response.data);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  };

  const itemsCellInteraction: ItemType[] = [
    {
      key: '1',
      label: (
        <div className={classNames([styles.dropdownButton])}>
          <span>Несуществующая деталь</span>
          <Switch onChange={addNotExistPart} />
        </div>
      ),
      action: 'Non-existent part',
    },
  ];

  return (
    <Dropdown
      getPopupContainer={getPopupContainer}
      trigger={['click']}
      menu={{
        items: itemsCellInteraction.map(item => ({
          ...item,
        })),
      }}
      onOpenChange={handleOpenChange}
      open={open}
    >
      <InteractionIcon />
    </Dropdown>
  );
};
