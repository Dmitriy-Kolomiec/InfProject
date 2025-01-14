import { Button, Form, MenuProps, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useState } from 'react';
import styles from './editRequest.module.css';
import classNames from 'classnames';
import { RequestContext } from '@/context/Request/request.context';
import axios from 'axios';
import { notify } from '@/data/utils.common';
import { API_ENDPOINTS } from '@/data/api/api.data';
import APIRequest from '@/data/api/api.utils';
import { SaveNotification } from './SaveNotification';
import { ITabList } from '@/app/components/TabList/tabList.props';
import { onSubmitSearchAddedItems } from '../TabList/AddingPositions/useAddingPositions.hook';
import { APP_PATHS } from '@/data/paths.data';

export const useEditRequest = () => {
  const [isOpenModalDeletion, setIsOpenModalDeletion] =
    useState<boolean>(false);
  const [isOpenModalSaveRequest, setIsOpenModalSaveRequest] =
    useState<boolean>(false);
  const { dataRequest, setDataRequest } = useContext(RequestContext);
  const searchParams = useSearchParams();
  const activeTab: string | null = searchParams.get('tab');
  const [isLoaderButton, setIsLoaderButton] = useState<boolean>(false);
  const [downloadingFile, setDownloadingFile] = useState<boolean>(false);

  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      message: <SaveNotification />,
      placement: 'top',
      duration: 3,
      className: styles.notification,
    });
  };
  const router = useRouter();

  const onSubmitSaveAddedItems = async () => {
    const requestBody = {
      id: dataRequest.request?.id,
      document: dataRequest.request?.document,
    };
    try {
      await APIRequest.post(API_ENDPOINTS.SAVE_REQUEST, requestBody);

      openNotification();
    } catch (error) {
      console.log('Ошибка при сохранении заявки:', error);
      if (axios.isAxiosError(error) && error.message) {
        notify('error', {
          message: error.message,
        });
      }
    }
  };

  const itemsAddPositions: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button className="button-transparent" onClick={onSubmitSaveAddedItems}>
          Сохранить черновик
        </Button>
      ),
    },
    {
      key: '2',
      label: (
        <Button
          className={classNames(['button-transparent', styles.buttonDropdown])}
          onClick={e => {
            e.preventDefault();
            setIsOpenModalDeletion(true);
          }}
        >
          Удалить заявку
        </Button>
      ),
    },
  ];

  const itemsOrderFormation: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button
          className="button-transparent"
          onClick={() => console.log('Отсрочка платежа')}
        >
          Отсрочка платежа
        </Button>
      ),
    },
    {
      key: '2',
      label: (
        <Button
          className="button-transparent"
          onClick={() => console.log('Редактировать')}
        >
          Редактировать
        </Button>
      ),
    },
    {
      key: '3',
      label: (
        <Button
          className={classNames(['button-transparent', styles.buttonDropdown])}
          onClick={e => {
            e.preventDefault();
            setIsOpenModalDeletion(true);
          }}
        >
          Удалить заявку
        </Button>
      ),
    },
  ];

  const tabList: ITabList[] = [
    { title: 'Информация о покупателе', nameQuery: 'recipientInfo' },
    { title: 'Добавление позиций', nameQuery: 'addition' },
    { title: ' Формирование заказа', nameQuery: 'formation' },
    { title: 'Оформление заказа', nameQuery: 'placing' },
  ];
  const requestDocument = dataRequest.request?.document;
  const infoRequest = dataRequest?.info;
  const orderRequest = dataRequest.request?.order;

  const [formEditRecipientInfo] = Form.useForm();
  const onSubmitRecipientInfo = () => {
    formEditRecipientInfo.submit();
  };

  const onSubmitNext = () => {
    if (activeTab === 'recipientInfo') {
      onSubmitRecipientInfo();
    }
    if (activeTab === 'addition') {
      onSubmitSearchAddedItems(
        dataRequest,
        setIsLoaderButton,
        router,
        dataRequest.request?.document,
      );
    }

    if (activeTab === 'formation') {
      const requestId = dataRequest?.request?.id;
      if (requestId) {
        router.push(
          APP_PATHS.REQUESTS_VIEW(requestId) +
            '?' +
            new URLSearchParams({
              tab: 'placing',
            }).toString(),
        );
      }
    }
  };

  return {
    dataRequest,
    setDataRequest,
    isOpenModalDeletion,
    setIsOpenModalDeletion,
    isOpenModalSaveRequest,
    setIsOpenModalSaveRequest,
    activeTab,
    itemsAddPositions,
    itemsOrderFormation,
    contextHolder,
    tabList,
    router,
    isLoaderButton,
    setIsLoaderButton,
    requestDocument,
    formEditRecipientInfo,
    onSubmitNext,
    infoRequest,
    downloadingFile,
    setDownloadingFile,
    orderRequest,
  };
};
