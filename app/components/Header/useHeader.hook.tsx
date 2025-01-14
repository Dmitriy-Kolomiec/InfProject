import React, { useContext, useState } from 'react';
import styles from './Header.module.css';
import classNames from 'classnames';
import { APP_PATHS } from '@/data/paths.data';
import LogoutIcon from '@/public/logout.svg';
import { useDispatch, useSelector } from 'react-redux';
import { Button, MenuProps } from 'antd';
import { logout } from '@/store/slice/authSlice';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/store/store';
import { RequestContext } from '@/context/Request/request.context';
import { IUser } from '@/interface/user/user.interface';
import { generateNameForHeader } from '@/data/utils.common';

export const useHeader = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [openCatalog, setOpenCatalog] = useState(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const { setDataRequest } = useContext(RequestContext);
  const isAuth = useSelector<RootState, boolean>(state => state.auth.isAuth);
  const user = useSelector<RootState, IUser | null>(
    state => state.auth.profileUser,
  );

  const userName = generateNameForHeader(user?.firstName!, user?.lastName);
  const userRole = user?.roles;

  const showDrawer = () => {
    setOpenCatalog(!openCatalog);
  };

  const handleLogout = async () => {
    try {
      const actionResult = await dispatch(logout());
      if (logout.fulfilled.match(actionResult)) {
        router.push(APP_PATHS.HOME);
        router.refresh();
      }
    } catch (error: any) {
      console.error('Ошибка:', error);
    }
  };

  const items: MenuProps['items'] = [
    {
      label: <h4>{userName}</h4>,
      key: '0',
    },
    {
      label: (
        <Button
          className={classNames(['button-transparent', styles.buttonDropdown])}
          onClick={handleLogout}
        >
          <span>Выйти</span>
          <LogoutIcon />
        </Button>
      ),
      key: '4',
    },
  ];

  const createRequest = () => {
    localStorage.removeItem('request');
    setDataRequest({});
  };

  return {
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
  };
};
