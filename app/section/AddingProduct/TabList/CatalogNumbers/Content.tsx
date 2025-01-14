import PageContent from '@/app/components/PageContent/PageContent';
import styles from './partnumbers.module.css';
import { Button, Drawer, Form, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import ArrowIcon from '@/public/arrowNext.svg';
import ArrowLeftIcon from '@/public/arrow-left.svg';
import { useContext, useEffect, useState } from 'react';
import PartnumbersNotAdd from './Components/PartnumbersNotAdd/PartnumbersNotAdd';
import Partnumbers from './Partnumbers';
import CloseIcon from '@/public/close.svg';
import DrawerAddingPartnumbers from './Components/Drawer/AddPartnumbers';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { IAddPartNumber } from '@/interface/addingProduct/addPartNumber.interface';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import axios from 'axios';
import { notify } from '@/data/utils.common';
import { LoadingOutlined } from '@ant-design/icons';

export default function TabPartnumbers(): React.ReactElement {
  const [openDrawerAddPartnumber, setOpenDrawerAddPartnumber] =
    useState<boolean>(false);
  const router = useRouter();
  const [form] = Form.useForm();
  const { dataProduct, setDataProduct } = useContext(ProductContext);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoaderSubmit, setIsLoaderSubmit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (dataProduct.partNumbers) {
      setIsLoading(false);
    }
  }, [dataProduct.partNumbers]);
  const [fileIdsDescription, setFileIdsDescription] = useState<number[]>([]);

  const onFinishSubmitPartnumbers = async (value: IAddPartNumber) => {
    setIsLoaderSubmit(true);
    const productManufacturers = value.manufacturers?.map(item => ({
      manufacturerId: item.manufacturerId,
      rating: Number(item.rating),
      review: item.review,
    }));
    const productAutoModels = value.autoModelsIds?.map(model => ({
      id: model.vehicleId,
      amount: Number(model.amount) || undefined,
      identifyMethod: model.identifyMethod,
      externalScheme: model.externalScheme,
    }));
    const requestBody = {
      productId: dataProduct.product.id,
      partNumber: value.partNumber,
      autoModels: productAutoModels,
      manufacturers: productManufacturers,
      fileIds: fileIdsDescription,
    };
    try {
      const { data } = await APIRequest.post(
        API_ENDPOINTS.ADD_PRODUCT_PARTNUMBER,
        requestBody,
      );
      setDataProduct(state => ({
        ...state,

        partNumbers: data,
      }));
      form.resetFields();
      setIsLoaderSubmit(false);
      onClose();
    } catch (error) {
      console.error('Ошибка при создании каталожного номера:', error);
      if (axios.isAxiosError(error) && error.message) {
        setIsLoaderSubmit(false);
        notify('error', {
          message: error.message,
        });
      }
    }
  };

  const showDrawerAddPartnumber = () => {
    setOpenDrawerAddPartnumber(true);
  };
  const onClose = () => {
    setOpenDrawerAddPartnumber(false);
  };
  const saveFormAddPartnumber = () => {
    form.submit();
    onClose();
  };

  return (
    <div>
      {isLoading && !dataProduct.partNumbers ? (
        <PageContent className={styles.loader}>
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </PageContent>
      ) : (
        <PageContent>
          {!!dataProduct.partNumbers?.length ? (
            <Partnumbers showDrawerAddPartnumber={showDrawerAddPartnumber} />
          ) : (
            <PartnumbersNotAdd showDrawer={showDrawerAddPartnumber} />
          )}
        </PageContent>
      )}

      <div className={styles.buttonWrapper}>
        <Button
          onClick={() => router.push('/')}
          className={classNames(['button-transparent'])}
        >
          Отмена
        </Button>
        <div className={styles.rightBlockBtn}>
          <Button
            className={classNames(['button-transparent', styles.buttonBack])}
            onClick={router.back}
          >
            <ArrowLeftIcon />
            <span>Назад</span>
          </Button>
          <Button
            className={classNames(['button-primary', styles.nextButton])}
            htmlType="submit"
          >
            Продолжить
            <ArrowIcon />
          </Button>
        </div>
      </div>
      <Drawer
        styles={{
          body: {
            padding: 0,
          },
        }}
        title="Добавление каталожного номера"
        onClose={onClose}
        open={openDrawerAddPartnumber}
        width={480}
        closeIcon={false}
        extra={
          <Button className="button-transparent" onClick={onClose}>
            <CloseIcon />
          </Button>
        }
        footer={
          <Button
            className={classNames(['button-primary', styles.saveButton])}
            htmlType="submit"
            onClick={saveFormAddPartnumber}
            disabled={isDisabled}
            loading={isLoaderSubmit}
          >
            Сохранить
          </Button>
        }
      >
        <DrawerAddingPartnumbers
          form={form}
          onFinish={onFinishSubmitPartnumbers}
          setIsDisabled={setIsDisabled}
          setFileIdsDescription={setFileIdsDescription}
        />
      </Drawer>
    </div>
  );
}
