'use client';
import Link from 'next/link';
import PageContent from '../../PageContent/PageContent';
import styles from './placingOrderPromo.module.css';
import { APP_PATHS } from '@/data/paths.data';
import ArrowNextIcon from '@/public/arrowNext.svg';
import ArrowLongIcon from '@/public/arrowLong.svg';

const stetByStepInfo = [
  { number: 1, text: 'Находим и кладём в корзину нужный товар' },
  { number: 2, text: 'Отправляем запрос поставщикам и ждём предложений' },
  { number: 3, text: 'Выбираем лучшее предложение и оплачиваем заказ' },
];

export default function PlacingOrderPromo() {
  return (
    <PageContent className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Оформить заказ очень легко</h3>
        <span className={styles.subTitle}>Всего несколько простых шагов</span>
      </div>
      <div className={styles.info}>
        <div className={styles.infoContainer}>
          {stetByStepInfo.map(item => (
            <div key={item.number} className={styles.item}>
              <span className={styles.number}>{item.number}</span>
              <div className={styles.text}>{item.text}</div>
            </div>
          ))}
          <div className={styles.primaryItem}>
            <span>А ещё мы зачислим кэшбек реальными деньгами!</span>
            <Link className={styles.link} href={APP_PATHS.HOME}>
              Перейти в каталог
              <ArrowNextIcon />
            </Link>
          </div>
          <div className={styles.arrowLong}>
            <ArrowLongIcon />
          </div>
        </div>
      </div>
    </PageContent>
  );
}
