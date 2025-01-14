import React from 'react';
import Link from 'next/link';
import styles from '../../Header.module.css';
import classNames from 'classnames';
import { APP_PATHS } from '@/data/paths.data';
import { useSelector } from 'react-redux';
import { Badge, Button } from 'antd';
import { RootState } from '@/store/store';
import HamburgerIcon from '@/public/hamburger.svg';
import WhatsAppIcon from '@/public/whatsAppIcon.svg';
import EmailIcon from '@/public/emaiIcon.svg';
import LogoIcon from './logo.svg';

interface IProps {
  showDrawer: () => void;
  isMounted: boolean;
}

export const NotAuthorizedHeader = ({ isMounted, showDrawer }: IProps) => {
  const productCount = useSelector((s: RootState) => s.cart.products.length);

  return (
    <>
      <nav className={styles.menu}>
        <Link href={APP_PATHS.HOME} className={styles.logo}>
          <LogoIcon />
        </Link>
        <div className={styles.buttonWrapper}>
          <>
            <Button
              className={classNames(['button-primary', styles.catalogBtn])}
              onClick={showDrawer}
            >
              <HamburgerIcon />
              Каталог
            </Button>
            <Link
              href={{
                pathname: APP_PATHS.INFORMATION_SECTION('delivery'),
              }}
              className={classNames(['button-transparent', styles.btn])}
            >
              Информация
            </Link>
            <Link
              href={{
                pathname: APP_PATHS.CONTACTS,
              }}
              className={classNames(['button-transparent', styles.btn])}
            >
              Контакты
            </Link>
          </>
        </div>
      </nav>
      <div className={styles.rightBlock}>
        <>
          <a
            className={styles.linkContact}
            href="mailto:uralzavoddetal@yandex.ru"
          >
            <EmailIcon />
          </a>
          <a
            className={styles.linkContact}
            href="https://wa.me/+79832401766"
            target="_blank"
          >
            <WhatsAppIcon />
          </a>
          <a className={styles.linkContact} href="tel:+79832401766">
            8 (983) 240-17-66
          </a>
          <Link
            href={{
              pathname: APP_PATHS.CART,
            }}
            className={classNames(['button-transparent', styles.btn])}
          >
            Корзина
            {isMounted && !!productCount && <Badge count={productCount} />}
          </Link>
        </>
      </div>
    </>
  );
};
