'use client';
import { Title } from '@/app/components/Title/Title';
import styles from './supplyRequests.module.css';
import PageContent from '@/app/components/PageContent/PageContent';
import { Button, Drawer, Form } from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import CloseIcon from '@/public/close.svg';
import { DrawerRequest } from './Components/drawer/DrawerRequest';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { useSearchParams } from 'next/navigation';
import { TableContent } from './Components/content/TableContent';

export interface ISupplyTable {
  totalAmount: number;
  data: ISupplyRequest[];
}
export interface ISupplyRequest {
  address: string | null;
  addressId: number | null;
  amount: number;
  available: number;
  dateAvailable: number;
  dateCreate: string;
  dateDeadline: string;
  id: number;
  inStock: number;
  inn: string | null;
  manufacturer: string | null;
  name: string;
  partNumber: string[];
  price: number;
  reasonToCancel: null;
  sellerContacts: null;
  sellerId: null;
  sellerName: null;
  status:
    | 'send'
    | 'canceled'
    | 'in_progress'
    | 'rejected'
    | 'new_request'
    | 'completed';
  vat: number;
}

export const SupplyRequestsPageContent = () => {
  const [isDisabledFormSubmit, setIsDisabledFormSubmit] =
    useState<boolean>(true);
  const [formProduct] = Form.useForm();
  const [formSupplier] = Form.useForm();
  // Pagination
  const searchParams = useSearchParams();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [dataRequests, setDataRequests] = useState<ISupplyTable>();
  const pageSize: number = Number(searchParams.get('pageSize')) || 10;
  const page: number = Number(searchParams.get('page')) || 1;
  const layout: string | undefined = searchParams.get('layout') || undefined;

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await APIRequest.get<ISupplyTable>(
        API_ENDPOINTS.GET_SUPPLY_REQUESTS(layout, page, pageSize),
      );
      setDataRequests(data);
    };
    fetchData();
  }, [page, pageSize, layout]);

  // Drawer
  const onOpenDrawer = () => {
    setOpenDrawer(true);
  };
  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const onFinish = async (value: any) => {
    console.log('onFinish', value);
    onCloseDrawer();
  };

  return (
    <>
      <Title tag="h2">Запросы</Title>
      <PageContent>
        <TableContent dataRequests={dataRequests} onOpenDrawer={onOpenDrawer} />
      </PageContent>
      <Drawer
        styles={{
          body: {
            padding: 16,
            backgroundColor: '#eaeaea',
          },
        }}
        onClose={onCloseDrawer}
        open={openDrawer}
        width={480}
        closeIcon={false}
        extra={
          <Button className="button-transparent" onClick={onCloseDrawer}>
            <CloseIcon />
          </Button>
        }
        title="Наименование не указано"
        footer={
          <Button
            className={classNames(['button-primary', styles.saveButton])}
            htmlType="submit"
            onClick={onFinish}
            disabled={isDisabledFormSubmit}
          >
            Сохранить
          </Button>
        }
      >
        <DrawerRequest
          formProduct={formProduct}
          formSupplier={formSupplier}
          setIsDisabled={setIsDisabledFormSubmit}
          onFinish={onFinish}
        />
      </Drawer>
    </>
  );
};
