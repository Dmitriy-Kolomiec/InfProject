import PageContent from '../../PageContent/PageContent';
import styles from './mobileAppPromo.module.css';
import Image from 'next/image';

export default function MobileAppPromo() {
  return (
    <PageContent className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          Искать и заказывать удобнее в мобильном приложении
        </h2>
        <div className={styles.stores}>
          <Image
            src="/image/appstore.png"
            width={137}
            height={44}
            alt="app store"
          />
          <Image
            src="/image/googleplay.png"
            width={148}
            height={44}
            alt="google play"
          />
        </div>
      </div>
      <Image src="/image/phone.png" width={436} height={420} alt="phone" />
      <Image
        className={styles.qrCode}
        src="/image/QRCode.png"
        width={202}
        height={202}
        alt="QR Code"
      />
    </PageContent>
  );
}
