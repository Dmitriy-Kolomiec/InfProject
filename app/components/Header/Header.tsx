'use client';
import React, { useEffect } from 'react';
import styles from './Header.module.css';
import classNames from 'classnames';
import { HeaderProps } from './Header.props';
import { Drawer } from 'antd';
import { DrawerCatalog } from './Components/drawer/DrawerCatalog';
import { AuthorizedHeader } from './Components/Content/AuthorizedHeader';
import { NotAuthorizedHeader } from './Components/Content/NotAuthorizedHeader';
import { useHeader } from './useHeader.hook';
import { parseCookies } from 'nookies';
import Link from 'next/link';
import Image from 'next/image';
import { APP_PATHS } from '@/data/paths.data';
import { useDispatch } from 'react-redux';
import { getProfileUser } from '@/store/slice/authSlice';
import { AppDispatch } from '@/store/store';
import LogoIcon from '@/public/logo.svg';

export default function Header({
  className,
  ...props
}: HeaderProps): React.ReactElement {
  const {
    openCatalog,
    setOpenCatalog,
    isMounted,
    setIsMounted,
    isAuth,
    showDrawer,
    items,
    createRequest,
    userName,
    userRole,
  } = useHeader();

  const cookies = parseCookies();
  const accessToken = cookies['accessToken'];

  useEffect(() => {
    setIsMounted(true);
  }, [isAuth]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (accessToken) {
      dispatch(getProfileUser());
    }
  }, [accessToken, dispatch]);

  return (
    <header className={classNames([styles.header, className])} {...props}>
      {!isMounted ? (
        <nav className={styles.menu}>
          <Link href={APP_PATHS.HOME} className={styles.logo}>
            <LogoIcon />
          </Link>
        </nav>
      ) : (
        <>
          {!accessToken ? (
            <NotAuthorizedHeader
              isMounted={isMounted}
              showDrawer={showDrawer}
            />
          ) : (
            <>
              {!!userRole && (
                <AuthorizedHeader
                  createRequest={createRequest}
                  items={items}
                  userName={userName}
                  userRole={userRole}
                />
              )}
            </>
          )}
        </>
      )}

      <Drawer
        title={null}
        placement="top"
        closable={false}
        onClose={showDrawer}
        open={openCatalog}
        zIndex={20}
        className={styles.drawer}
        height="85%"
        width="100%"
      >
        <DrawerCatalog
          hideDrawer={setOpenCatalog}
          className={styles.drawerCatalog}
        />
      </Drawer>
    </header>
  );
}
