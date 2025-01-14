import {
  INotExist,
  IPropertyValuesComb,
  ITableData,
} from '@/interface/addingProduct/partNumbers.interface';
import { DropdownProps, Switch, Dropdown } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import InteractionIcon from '@/public/interaction.svg';
import classNames from 'classnames';
import styles from './tableNotExists.module.css';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { getPopupContainer } from '@/data/utils.common';

type ItemType = { key: string; label: JSX.Element; action: string };

interface IProps {
  data?: INotExist;
  selectRowTable?: ITableData;
  setDataNotPartNumber: Dispatch<
    SetStateAction<IPropertyValuesComb | undefined>
  >;
  fetchNotExist: () => Promise<void>;
}

export const DropdownCellNotExist = ({
  selectRowTable,
  setDataNotPartNumber,
  fetchNotExist,
}: IProps) => {
  const [open, setOpen] = useState(false);
  const handleOpenChange: DropdownProps['onOpenChange'] = (nextOpen, info) => {
    if (info.source === 'trigger' || nextOpen) {
      setOpen(nextOpen);
    }
  };

  const deleteNotExistPart = async (checked: boolean) => {
    if (!checked) {
      try {
        const response = await APIRequest.delete(
          API_ENDPOINTS.DELETE_NOT_EXIST(selectRowTable?.combinationId!),
        );
        setDataNotPartNumber(response.data);
        fetchNotExist();
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
          <Switch onChange={deleteNotExistPart} defaultChecked={true} />
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
