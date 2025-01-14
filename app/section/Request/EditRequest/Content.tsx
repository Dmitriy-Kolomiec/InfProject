'use client';
import PageContent from '@/app/components/PageContent/PageContent';
import { Title } from '@/app/components/Title/Title';
import styles from './editRequest.module.css';
import { Button, Dropdown, Modal, Space } from 'antd';
import Image from 'next/image';
import DeleteRequestModal from '@/app/components/Modal/Request/delete-request/DeleteRequest';
import AddRequestPageContentTabs from '../TabList/Tabs';
import { formatPrice, getPopupContainer, notify } from '@/data/utils.common';
import { useEditRequest } from './useEditRequest.hook';
import SaveRequestModal from '@/app/components/Modal/Request/save-request/SaveRequest';
import TabList from '@/app/components/TabList/TabList';
import React, { useEffect } from 'react';
import ArrowIcon from '@/public/arrowNext.svg';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { IAboutRequest } from '@/interface/request/request.interface';
import classNames from 'classnames';
import axios from 'axios';
import { downloadCompetitionSheet } from '../TabList/PlacingOrder/PlacingOrder.hook';
import { APP_PATHS } from '@/data/paths.data';

interface IProps {
  alias: string;
}
export default function EditRequestPageContent({
  alias,
}: IProps): React.ReactElement {
  const {
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
    isLoaderButton,
    requestDocument,
    formEditRecipientInfo,
    onSubmitNext,
    infoRequest,
    router,
    downloadingFile,
    setDownloadingFile,
    orderRequest,
  } = useEditRequest();

  useEffect(() => {
    const initialProducts = localStorage.getItem('request');
    const parsedRequest = initialProducts ? JSON.parse(initialProducts) : null;

    const fetchRequest = async () => {
      try {
        const { data } = await APIRequest.get<IAboutRequest>(
          API_ENDPOINTS.GET_REQUEST(alias),
        );
        console.log('Данные о заявке, ответ с сервера: ', data);

        setDataRequest(prevState => {
          let finalDocument = data.request?.document || [];
          if (parsedRequest?.requestId === data.request?.id) {
            const documentsFromLocalStorage = parsedRequest.document || [];

            documentsFromLocalStorage.forEach((localDoc: any) => {
              const existingIndex = finalDocument.findIndex(
                doc => doc.id === localDoc.id,
              );
              if (existingIndex > -1) {
                finalDocument[existingIndex] = {
                  ...finalDocument[existingIndex],
                  ...localDoc,
                };
              } else {
                finalDocument.push(localDoc);
              }
            });
          }

          return {
            ...prevState,
            customer: data.customer,
            info: data.info,
            filteringItems: data.filteringItems,
            request: {
              ...data.request,
              order: [],
              document: finalDocument,
            },
          };
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 400 || error.response.status === 500) {
            router.push(APP_PATHS.REQUESTS_LIST);
          }
        }
        if (axios.isAxiosError(error) && error.message) {
          notify('error', {
            message: error.message,
          });
        }
      }
    };
    fetchRequest();
  }, []);

  return (
    <>
      {contextHolder}
      <div>
        <div className={styles.pageTop}>
          <Title tag="h1">
            Заявка №{' '}
            {dataRequest.request?.titleId
              ? dataRequest.request.titleId
              : '000000'}
          </Title>
          <div className={styles.buttonWrapper}>
            {activeTab === 'placing' && (
              <Button
                className="button-primary"
                onClick={() =>
                  downloadCompetitionSheet(
                    setDownloadingFile,
                    dataRequest.request?.id,
                  )
                }
                loading={downloadingFile}
              >
                Скачать конкурентный лист
              </Button>
            )}
            {activeTab !== 'placing' && (
              <Button
                className={classNames(['button-primary', styles.button], {
                  [styles.disabledIcon]: !requestDocument?.length,
                })}
                disabled={
                  (!requestDocument?.length && activeTab === 'addition') ||
                  (!orderRequest?.length && activeTab === 'formation')
                }
                onClick={onSubmitNext}
                loading={isLoaderButton}
              >
                <span>Продолжить</span>
                <ArrowIcon />
              </Button>
            )}
            <Space>
              <Dropdown
                getPopupContainer={getPopupContainer}
                className={styles.dropdown}
                menu={{
                  items:
                    activeTab === 'addition' || activeTab === null
                      ? itemsAddPositions
                      : itemsOrderFormation,
                }}
              >
                <Image src="/ellipsis.svg" width={40} height={40} alt="icon" />
              </Dropdown>
            </Space>
          </div>
        </div>
        {activeTab !== 'addition' &&
          activeTab !== 'recipientInfo' &&
          activeTab !== null && (
            <div className={styles.requestInfo}>
              <span>
                Позиций в заявке{' '}
                <b>{requestDocument ? requestDocument.length : '0'}</b>
              </span>
              <span>
                Добавлено в заказ <b>{infoRequest?.addedItemsToOrder || 0}</b>
              </span>
              <span>
                Поставщиков <b>{infoRequest?.numberOfSellers || 0}</b>
              </span>
              <span>
                Сумма заявки{' '}
                <b>{formatPrice(infoRequest?.total || 0)} &#8381;</b>
              </span>
            </div>
          )}
      </div>
      <PageContent className={styles.tabContainer}>
        <TabList
          activeTab={activeTab || 'recipientInfo'}
          tabList={tabList}
          readonly
        />
        <div className={styles.totalPrice}>
          <span>Сумма заказа </span>
          <span>{formatPrice(infoRequest?.total || 0)} &#8381;</span>
        </div>
      </PageContent>
      <AddRequestPageContentTabs
        activeTab={activeTab}
        formRecipientInfo={formEditRecipientInfo}
      />
      <Modal
        open={isOpenModalDeletion}
        onCancel={() => setIsOpenModalDeletion(false)}
        centered
        className={styles.modalDelete}
        title={null}
        footer={null}
        width={520}
      >
        <DeleteRequestModal hideModal={setIsOpenModalDeletion} />
      </Modal>
      <Modal
        open={isOpenModalSaveRequest}
        onCancel={() => setIsOpenModalSaveRequest(false)}
        centered
        className={styles.modalDelete}
        title={null}
        footer={null}
        width={440}
      >
        <SaveRequestModal />
      </Modal>
    </>
  );
}
