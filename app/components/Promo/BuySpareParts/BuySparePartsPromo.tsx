import PageContent from '../../PageContent/PageContent';
import styles from './buySparePartsPromo.module.css';
import Image from 'next/image';
import { BuySparePartsProps } from './buySparePartsPromo.props';

export default function BuySparePartsPromo({
  basketImage,
}: BuySparePartsProps) {
  return (
    <PageContent className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          Купить любые запчасти
          <br /> просто и быстро
        </h2>
        <span className={styles.text}>
          Помогаем найти товары
          <br />
          и заключить договор поставки между
          <br />
          Поставщиком и Покупателем.
        </span>
      </div>
      {basketImage ? (
        <Image
          className={styles.image}
          src="/image/basketCarSpares.png"
          width={719}
          height={431}
          alt="image"
        />
      ) : (
        <div className={styles.imageContainer}>
          <Image
            className={styles.images}
            src="/image/oilFilter.png"
            width={336}
            height={336}
            alt="image"
          />
          <Image
            className={styles.images}
            src="/image/sparkPlug.png"
            width={336}
            height={336}
            alt="image"
          />
        </div>
      )}
    </PageContent>
  );
}
