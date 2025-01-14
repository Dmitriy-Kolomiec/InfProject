'use client';
import { Title } from '@/app/components/Title/Title';
import { Button } from 'antd';
import Image from 'next/image';
import styles from './notification.module.css';
import classNames from 'classnames';
import { NotificationsProps } from './Notifications.props';
import React from 'react';

export default function NotificationAddPosition({
  setHideInfo,
  setOpenModal,
  className,
  ...props
}: NotificationsProps): React.ReactElement {
  return (
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
        <Title tag="h3">Способы добавления позиций</Title>
        <div className={styles.list}>
          <span>Вы можете добавить позиции тремя способами:</span>
          <ol className={styles.ol}>
            <li>
              Загрузить список позиций из шаблона. Необходимо скачать шаблон,
              заполнить его и загрузить обратно;
            </li>
            <li>
              Загрузить список позиций из файла. Например, вы можете загрузить
              фотографию списка позиций (или другой файл);
            </li>
            <li>Вручную, с помощью поиска по каталогу.</li>
          </ol>
        </div>
        <Button
          className={classNames([styles.button, 'button-white'])}
          onClick={() => setOpenModal(true)}
        >
          Загрузить список позиций
        </Button>
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
  );
}
