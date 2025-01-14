'use client';
import PageContent from '@/app/components/PageContent/PageContent';
import { Title } from '@/app/components/Title/Title';
import styles from './addRequest.module.css';
import { Button, Modal } from 'antd';
import DeleteRequestModal from '@/app/components/Modal/Request/delete-request/DeleteRequest';
import AddRequestPageContentTabs from '../TabList/Tabs';
import { formatPrice } from '@/data/utils.common';
import { useAddRequest } from './useAddRequest.hook';
import TabList from '@/app/components/TabList/TabList';
import React from 'react';
import ArrowIcon from '@/public/arrowNext.svg';
import classNames from 'classnames';

export default function AddRequestPageContent({}): React.ReactElement {
  const {
    isOpenModalDeletion,
    setIsOpenModalDeletion,
    activeTab,
    tabList,
    isDisabled,
    setIsDisabled,
    isLoader,
    setIsLoader,
    formRecipientInfo,
    onSubmitRecipientInfo,
  } = useAddRequest();

  return (
    <>
      <div>
        <div className={styles.pageTop}>
          <Title tag="h1">Создание заявки</Title>
          <div className={styles.buttonWrapper}>
            <Button
              className={classNames(['button-primary'], {
                [styles.disabledIcon]: isDisabled,
              })}
              onClick={onSubmitRecipientInfo}
              disabled={isDisabled}
              loading={isLoader}
            >
              <span>Продолжить</span>
              <ArrowIcon />
            </Button>
          </div>
        </div>
      </div>
      <PageContent className={styles.tabContainer}>
        <TabList
          activeTab={activeTab || 'recipientInfo'}
          tabList={tabList}
          readonly
        />
        <div className={styles.totalPrice}>
          <span>Сумма заказа </span>
          <span>{formatPrice(0)} ₽</span>
        </div>
      </PageContent>
      <AddRequestPageContentTabs
        activeTab="recipientInfo"
        setIsDisabled={setIsDisabled}
        setIsLoader={setIsLoader}
        formRecipientInfo={formRecipientInfo}
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
    </>
  );
}
