import classNames from 'classnames';
import { Title } from '../Title/Title';
import styles from './notification.module.css';
import Image from 'next/image';

interface IProps {
  title?: string;
  text: string;
  className?: string;
}

export default function NotificationDanger({ title, text, className }: IProps) {
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
      <div className={classNames([styles.contentBlock, className])}>
        <Title tag="h3">{title}</Title>
        <div className={styles.list}>
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
}
