import styles from './smallMobileApp.module.css';
import Image from 'next/image';

export default function SmallMobileAppPRomo() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h3 className={styles.title}>
          Искать и заказывать удобнее <br /> в мобильном приложении
        </h3>
        <Image
          src="/image/appStoreWhite.png"
          width={137}
          height={44}
          alt="app store"
        />
        <Image
          src="/image/googlePlayWhite.png"
          width={149}
          height={44}
          alt="google play"
        />
      </div>
      <div className={styles.images}>
        <Image
          className={styles.imageFirst}
          src="/image/phoneFirst.png"
          width={233}
          height={80}
          alt="google play"
        />
        <Image
          className={styles.imageSecond}
          src="/image/phoneSecond.png"
          width={233}
          height={80}
          alt="google play"
        />
        <Image
          className={styles.imageThird}
          src="/image/phoneThird.png"
          width={233}
          height={80}
          alt="google play"
        />
      </div>
    </div>
  );
}
