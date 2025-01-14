'use client';
import styles from './content.module.css';
import { Button, Pagination, Select, Table, TableProps, Tag } from 'antd';
import classNames from 'classnames';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { convertDateToDDMMYYYY, getPopupContainer } from '@/data/utils.common';
import { ISupplyRequest, ISupplyTable } from '../../Content';

type ColumnsType<T> = TableProps<T>['columns'];

interface IProps {
  dataRequests: ISupplyTable | undefined;
  onOpenDrawer: () => void;
}

export const TableContent = ({ dataRequests, onOpenDrawer }: IProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const pageSize: number = Number(searchParams.get('pageSize')) || 10;
  const page: number = Number(searchParams.get('page')) || 1;

  const handleChangeSelect = (value: string) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set('pageSize', String(value || 10));
    router.replace(`${pathname}?${queryParams.toString()}`, {
      scroll: false,
    });
  };
  // Изменение значения page через Пагинацию
  const onChangePagination = (value: number) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set('page', String(value || 1));
    router.replace(`${pathname}?${queryParams.toString()}`);
  };

  const columns: ColumnsType<ISupplyRequest> = [
    {
      title: <span className={styles.titleCol}>№</span>,
      dataIndex: 'id',
      align: 'center',
      width: '3%',
    },
    {
      title: <span className={styles.titleCol}>Наименование</span>,

      dataIndex: 'name',
      key: 'name',
      width: '40%',
      render: name => (
        <span className={styles.nameCell} onClick={onOpenDrawer}>
          {name}
        </span>
      ),
    },
    {
      title: <span className={styles.titleCol}>Каталожный номер</span>,
      dataIndex: 'partNumber',
      key: 'partNumber',
      width: '9%',
    },
    {
      title: <span className={styles.titleCol}>Количество в запросе, шт</span>,
      dataIndex: 'amount',
      key: 'amount',
      width: '9%',
    },
    {
      title: <span className={styles.titleCol}>Статус</span>,
      key: 'status',
      width: '9%',
      render: (_, record) => {
        const { status } = record;

        let text = 'Отклонён';
        let color = '#FFE8E7';

        switch (status) {
          case 'completed':
            text = 'Завершён';
            color = '#ECFAEB';
            break;
          case 'send':
            text = 'Отправлен';
            color = '#EAEAEA';
            break;
          case 'in_progress':
            text = 'В работе';
            color = 'blue';
            break;
          case 'canceled':
            text = 'Отменён';
            color = 'warning';
            break;
        }

        return (
          <Tag
            className={classNames([styles.tag], {
              [styles.tagCanceled]: status === 'canceled',
              [styles.tagRejected]: status === 'rejected',
              [styles.tagInProgress]: status === 'in_progress',
              [styles.tagSend]: status === 'send',
              [styles.tagCompleted]: status === 'completed',
            })}
            color={color}
          >
            {text.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: <span className={styles.titleCol}>Отправлен</span>,
      dataIndex: 'dateCreate',
      key: 'dateCreate',
      width: '9%',
      render: date => {
        return <span>{convertDateToDDMMYYYY(date)}</span>;
      },
    },
    {
      title: <span className={styles.titleCol}>Завершён / Отклонён</span>,
      dataIndex: 'dateDeadline',
      key: 'dateDeadline',
      width: '9%',
      render: date => {
        return <span>{convertDateToDDMMYYYY(date)}</span>;
      },
    },

    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '11%',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <Button className={classNames(['button-white', styles.button])}>
              Отменить
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Table
        pagination={false}
        size="small"
        showSorterTooltip={false}
        columns={columns}
        rowKey={record => `${record.id}_${record.dateCreate}`}
        dataSource={dataRequests?.data}
        bordered
      />
      <div className={styles.pagination}>
        <Pagination
          defaultCurrent={page || 1}
          current={page}
          total={dataRequests?.totalAmount}
          pageSize={pageSize}
          onChange={onChangePagination}
        />
        {dataRequests && dataRequests?.totalAmount > 10 && (
          <div>
            <span className={styles.labelSelect}>Отображать по</span>
            <Select
              getPopupContainer={getPopupContainer}
              defaultValue="10"
              onChange={handleChangeSelect}
              popupMatchSelectWidth={60}
              options={[
                {
                  value: '10',
                  label: '10',
                },
                {
                  value: '20',
                  label: '20',
                },
                {
                  value: '50',
                  label: '50',
                },
                {
                  value: '100',
                  label: '100',
                },
              ]}
            />
          </div>
        )}
      </div>
    </>
  );
};
