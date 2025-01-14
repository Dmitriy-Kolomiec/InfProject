'use client';
import { Title } from '@/app/components/Title/Title';
import { Button } from 'antd';
import Image from 'next/image';
import styles from './notification.module.css';
import classNames from 'classnames';
import React from 'react';
import { NotificationsProps } from './Notifications.props';

export default function NotificationModalAddPosition({
  setHideInfo,
  setDownloadType,
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
          <span>
            Процесс обработки файла после загрузки может занять несколько часов.
            Для того, чтобы загрузить позиции быстрее, воспользуйтесь загрузкой
            из шаблона.
          </span>
        </div>
        <Button
          className={classNames([styles.button, 'button-white'])}
          onClick={() => setDownloadType('template')}
        >
          Загрузить из шаблона
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
