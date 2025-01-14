import { Title } from '@/app/components/Title/Title';
import { Modal } from 'antd';
import Image from 'next/image';
import styles from './notification.module.css';
import classNames from 'classnames';
import React, { useState } from 'react';
import ChangeSupplierResTimes from '../Modal/Request/change-supplier-res-times/ChangeSupplierResTimes';
import RequestInfoSuppliers from '../Modal/Request/request-info-suppliers/RequestInfoSuppliers';
import { NotificationsProps } from './Notifications.props';

export default function NotificationInformationRequired({
  setHideInfo,
  className,
  ...props
}: NotificationsProps): React.ReactElement {
  const [isOpenModalResTimes, setIsOpenModalResTimes] =
    useState<boolean>(false);
  const [isOpenModalReqInfoSuppliers, setIsOpenModalReqInfoSuppliers] =
    useState<boolean>(false);

  return (
    <>
      <div className={classNames([styles.container, className])} {...props}>
        <div className={styles.iconBlock}>
          <Image
            src="/notise.svg"
            width={20}
            height={20}
            alt="icon"
            className={styles.notiseImage}
          />
        </div>
        <div className={styles.contentBlock}>
          <Title tag="h3">Необходим запрос информации.</Title>
          <div className={styles.list}>
            <span>
              В составе заявки есть позиции, требующие дополнительного запроса у
              поставщиков. <br />
              Установленное максимальное время ответа: 3 дня. При необходимости,
              вы можете изменить время ответа.
            </span>
          </div>
          {/* <div className={styles.buttonWrapper}>
            <Button
              className={classNames([styles.button, 'button-white'])}
              onClick={e => {
                e.preventDefault();
                setIsOpenModalReqInfoSuppliers(true);
              }}
            >
              Запросить
            </Button>
            <Button
              className={classNames([styles.button, 'button-transparent'])}
              onClick={e => {
                e.preventDefault();
                setIsOpenModalResTimes(true);
              }}
            >
              Изменить время ответа
            </Button>
          </div> */}
        </div>
        <Image
          src="/close.svg"
          width={32}
          height={32}
          alt="close"
          className={styles.closeImage}
          onClick={() => setHideInfo(false)}
        />
      </div>

      <Modal
        open={isOpenModalResTimes}
        onCancel={() => setIsOpenModalResTimes(false)}
        centered
        className={styles.modalDelete}
        title={null}
        footer={null}
        width={480}
      >
        <ChangeSupplierResTimes />
      </Modal>
      <Modal
        open={isOpenModalReqInfoSuppliers}
        onCancel={() => setIsOpenModalReqInfoSuppliers(false)}
        centered
        className={styles.modalDelete}
        title={null}
        footer={null}
        width={520}
      >
        <RequestInfoSuppliers
          setIsOpenModalResTimes={setIsOpenModalResTimes}
          setIsOpenModalReqInfoSuppliers={setIsOpenModalReqInfoSuppliers}
        />
      </Modal>
    </>
  );
}
