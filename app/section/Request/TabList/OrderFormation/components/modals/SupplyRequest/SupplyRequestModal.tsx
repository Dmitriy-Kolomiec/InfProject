import { ISelectedRows } from '@/interface/request/request.interface';
import styles from './supplyRequest.module.css';
import { Button, DatePicker, DatePickerProps, Table, TableProps } from 'antd';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import axios from 'axios';
import { notify } from '@/data/utils.common';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';

dayjs.extend(customParseFormat);

interface IProps {
  selectedRows: ISelectedRows[];
  hideModal: Dispatch<SetStateAction<boolean>>;
  resetSelection: () => void;
}

type ColumnsType<T> = TableProps<T>['columns'];

export const SupplyRequestModal = ({
  selectedRows,
  hideModal,
  resetSelection,
}: IProps) => {
  const [dateDeadline, setDateDeadline] = useState<string>(
    dayjs().format('YYYY.MM.DD'),
  );
  const dateFormat = 'DD.MM.YYYY';

  const columns: ColumnsType<ISelectedRows> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
      render: record => {
        return (
          <div className={styles.manufacture}>{!!record ? record : '-'}</div>
        );
      },
    },
    {
      title: 'Каталожный номер',
      dataIndex: 'partNumber',
      key: 'partNumber',
      width: '30%',
      render: record => (
        <div className={styles.manufacture}>{!!record ? record : '-'}</div>
      ),
    },
    {
      title: 'В заявке, шт',
      dataIndex: 'amount',
      key: 'amount',
      width: '20%',
      render: record => {
        return <div className={styles.stockCell}>{record}</div>;
      },
    },
  ];

  const onChangeDatePicker: DatePickerProps['onChange'] = date => {
    if (date) {
      const formattedDate = dayjs(date).format('YYYY.MM.DD');
      setDateDeadline(formattedDate);
    }
  };

  const onSubmitSupplyRequest = async (selectedRows: ISelectedRows[]) => {
    const positionIds = selectedRows.map(item => item.positionId);
    const requestBody = {
      requestId: selectedRows[0].requestId,
      positionIds: positionIds,
      dateDeadline: dateDeadline,
    };

    try {
      const { data } = await APIRequest.post(
        API_ENDPOINTS.ADD_SUPPLY_REQUEST,
        requestBody,
      );
      if (data) {
        resetSelection();
      }
    } catch (error) {
      console.error('Ошибка при запросе в снабжение:', error);
      if (axios.isAxiosError(error) && error.message) {
        notify('error', {
          message: error.message,
        });
      }
    } finally {
      hideModal(false);
    }
  };

  return (
    <>
      <Table
        pagination={false}
        size="small"
        showSorterTooltip={false}
        columns={columns}
        rowKey={record => record.positionId}
        dataSource={selectedRows}
        bordered
        className={styles.table}
      />
      <div className={styles.datePicker}>
        <LabelTitle text="Срок поставки" />
        <DatePicker
          onChange={onChangeDatePicker}
          format={dateFormat}
          defaultValue={dayjs()}
        />
      </div>
      <div className={styles.buttonWrapper}>
        <Button onClick={() => hideModal(false)} className="button-transparent">
          Не отправлять
        </Button>
        <Button
          className={classNames(['button-primary', styles.button])}
          onClick={() => onSubmitSupplyRequest(selectedRows)}
        >
          Отправить
        </Button>
      </div>
    </>
  );
};
