'use client';
import { API_ENDPOINTS } from '@/data/api/api.data';
import APIRequest from '@/data/api/api.utils';
import { useEffect, useState } from 'react';
import styles from './requestsList.module.css';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import { Title } from '@/app/components/Title/Title';
import PageContent from '@/app/components/PageContent/PageContent';
import { Button, Modal, Spin, Table, TableProps } from 'antd';
import axios from 'axios';
import { notify } from '@/data/utils.common';
import Link from 'next/link';
import { LoadingOutlined } from '@ant-design/icons';
import DeleteRequest from './DeleteRequest';
import { APP_PATHS } from '@/data/paths.data';

type ColumnsType<T> = TableProps<T>['columns'];

export interface IListRequest {
  address: string;
  countUnprocessedSupplyRequests: number;
  customerName: string;
  id: number;
  isDefault: boolean;
  requestRowsCount: number;
  status: 'recipientInfo' | 'addition' | 'formation' | 'placing';
  titleId: string;
}

export default function RequestListPagePageContent() {
  const [dataRequests, setDataRequests] = useState<IListRequest[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpenModalDeletion, setIsOpenModalDeletion] =
    useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<{
    title: string;
    id: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await APIRequest.get(API_ENDPOINTS.GET_LIST_REQUESTS);
        if (data) {
          setIsLoading(false);
          setDataRequests(data.orders);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.message) {
          notify('error', {
            message: error.message,
          });
        }
      }
    };
    fetchData();
  }, []);
  const openModal = (value: IListRequest) => {
    setSelectedRequest({ id: value.id, title: value.titleId });
    setIsOpenModalDeletion(true);
  };

  const columns: ColumnsType<IListRequest> = [
    {
      title: '№',
      dataIndex: 'titleId',
      key: '1',
      width: '7%',
      render: (_, record) => {
        const { titleId, id, status } = record;
        return (
          <Link
            className={styles.titleId}
            href={{
              pathname: APP_PATHS.REQUESTS_VIEW(id),
              query: { tab: status },
            }}
          >
            {titleId}
          </Link>
        );
      },
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: '2',
      width: '30%',
    },
    {
      title: 'Наименование покупателя',
      dataIndex: 'customerName',
      key: '3',
      width: '30%',
    },
    {
      title: 'Количество',
      dataIndex: 'requestRowsCount',
      key: '4',
      width: '12%',
      className: `${styles.countCell}`,
      render: count => {
        return <span>{!!count ? count : '-'}</span>;
      },
    },
    {
      title: 'Шаг оформления',
      dataIndex: 'status',
      key: '5',
      width: '17%',
      render: (_, record) => {
        let text = 'Добавление информации о покупателе';
        const { status, countUnprocessedSupplyRequests } = record;

        if (status === 'addition') {
          text = 'Добавление позиций';
        }
        if (status === 'formation') {
          text = 'Формирование заказа';
        }
        if (status === 'placing') {
          text = 'Оформление заказа';
        }
        return (
          <div className={styles.statusCell}>
            <span>{text}</span>
            {!!countUnprocessedSupplyRequests && (
              <span className={styles.count}>
                {countUnprocessedSupplyRequests}
              </span>
            )}
          </div>
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
          <Button
            onClick={() => openModal(record)}
            className={styles.deleteButton}
          >
            <DeleteIcon />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Title tag="h2">Заявки</Title>
      <PageContent className={styles.container}>
        {isLoading ? (
          <PageContent className={styles.loader}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </PageContent>
        ) : (
          <>
            {!!dataRequests?.length ? (
              <Table
                size="small"
                showSorterTooltip={false}
                rowKey={record => record.id}
                columns={columns}
                dataSource={dataRequests}
                bordered
              />
            ) : (
              <PageContent isCenter>
                <Title tag="h3">Заявки не найдены</Title>
              </PageContent>
            )}
          </>
        )}
      </PageContent>
      {!!selectedRequest && (
        <Modal
          open={isOpenModalDeletion}
          onCancel={() => setIsOpenModalDeletion(false)}
          centered
          title={null}
          footer={null}
          width={520}
        >
          <DeleteRequest
            hideModal={setIsOpenModalDeletion}
            selectedRequest={selectedRequest}
            setDataRequests={setDataRequests}
          />
        </Modal>
      )}
    </>
  );
}
