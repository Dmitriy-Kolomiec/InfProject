import { Title } from '@/app/components/Title/Title';
import styles from './aboutSeller.module.css';
import { formatPrice } from '@/data/utils.common';
import { ISellerFinished } from '@/interface/request/request.interface';

interface IProps {
  seller: ISellerFinished;
}

export const AboutSeller = ({ seller }: IProps) => {
  const { name, totalSum, dateSync } = seller;

  const [year, month, day] = dateSync.split('-');
  const formattedDate = `${day}.${month}.${year}`;

  return (
    <div className={styles.aboutSeller}>
      <div>
        <span className={styles.subTitle}> Поставщик</span>
        <div>
          <span className={styles.name}>{name}</span>
          {formattedDate && (
            <span className={styles.relevance}>
              Обновление: {formattedDate}
            </span>
          )}
        </div>
      </div>
      <div className={styles.totalSumm}>
        <span>Сумма</span>
        <Title tag="h3">{formatPrice(totalSum)}&#8381;</Title>
      </div>
    </div>
  );
};
