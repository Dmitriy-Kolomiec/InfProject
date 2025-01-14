import { IInfoFinished } from '@/interface/request/request.interface';
import styles from './summary.module.css';
import { formatPrice } from '@/data/utils.common';
import { Title } from '@/app/components/Title/Title';

interface IProps {
  info: IInfoFinished | undefined;
}

export const SummaryRequest = ({ info }: IProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <span>
          Позиций в заявке <b>{info?.countPositionsInOrder || 0}</b>
        </span>
        <span>
          Добавлено в заказ <b>{info?.addedItemsToOrder || 0}</b>
        </span>
        <span>
          Поставщиков <b>{info?.numberOfSellers || 0}</b>
        </span>
      </div>
      <div className={styles.summ}>
        <span>Сумма заказа</span>
        <Title tag="h2">{formatPrice(info?.total || 0)} &#8381;</Title>
      </div>
    </div>
  );
};
