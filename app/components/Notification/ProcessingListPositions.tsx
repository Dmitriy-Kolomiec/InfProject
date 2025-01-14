import { Title } from '../Title/Title';
import styles from './notification.module.css';
import Image from 'next/image';

export default function NotificationProcessingListPositions() {
  return (
    <div className={styles.container}>
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
        <Title tag="h3">Идёт обработка списка позиций.</Title>
        <div className={styles.list}>
          <span>
            Идёт обработка списка позиций, пожалуйста, подождите. Вы сможете
            перейти к оформлению завки после обработки списка.
          </span>
        </div>
      </div>
    </div>
  );
}
