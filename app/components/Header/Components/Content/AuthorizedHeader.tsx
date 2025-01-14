import React from 'react';
import Link from 'next/link';
import styles from '../../Header.module.css';
import classNames from 'classnames';
import { APP_PATHS } from '@/data/paths.data';
import ListIcon from '@/public/listIcon.svg';
import PlusIcon from '@/public/plus.svg';
import UsersIcon from '@/public/users.svg';
import { Dropdown, MenuProps, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { getPopupContainer } from '@/data/utils.common';
import LogoIcon from './logo.svg';

interface IProps {
  createRequest: () => void;
  items: MenuProps['items'];
  userName: string;
  userRole: { title: string; name: string }[];
}

export const AuthorizedHeader = ({
  createRequest,
  items,
  userName,
  userRole,
}: IProps) => {
  const isManager = userRole.find(item => item.title === 'manager');
  const isAdmin = userRole.find(item => item.title === 'admin');

  return (
    <>
      <nav className={styles.menu}>
        <Link
          href={!isManager ? APP_PATHS.ADMIN : APP_PATHS.HOME}
          className={styles.logo}
        >
          <LogoIcon />
        </Link>
        <div className={styles.buttonWrapper}>
          {isManager ? (
            <>
              <Link
                href={{
                  pathname: APP_PATHS.REQUESTS_ADD,
                }}
                className={classNames(['button-transparent', styles.btn])}
                onClick={createRequest}
              >
                <PlusIcon />
                Создать заявку
              </Link>
              <Link
                href={{
                  pathname: APP_PATHS.REQUESTS_LIST,
                }}
                className={classNames(['button-transparent', styles.btn])}
              >
                Список заявок
              </Link>
              <Link
                href={{
                  pathname: APP_PATHS.SUPPLY_REQUESTS,
                }}
                className={classNames(['button-transparent', styles.btn])}
              >
                Запросы в снабжение
              </Link>
            </>
          ) : (
            <>
              <Link
                href={APP_PATHS.CATEGORIES}
                className={classNames(['button-transparent', styles.btn])}
              >
                <ListIcon />
                Категории
              </Link>
              <Link
                href={{
                  pathname: APP_PATHS.ADD_PRODUCT,
                }}
                className={classNames(['button-transparent', styles.btn])}
              >
                <PlusIcon />
                Добавить товар
              </Link>
              {!!isAdmin && (
                <Link
                  href={{
                    pathname: APP_PATHS.USERS,
                  }}
                  className={classNames(['button-transparent', styles.btn])}
                >
                  <UsersIcon />
                  Управление пользователями
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
      {!!userName && (
        <div className={styles.rightBlock}>
          <Dropdown
            getPopupContainer={getPopupContainer}
            menu={{ items }}
            trigger={['click']}
            overlayClassName={styles.dropdown}
          >
            <Space>
              <span className={styles.nameUser}>{userName}</span>
              <DownOutlined />
            </Space>
          </Dropdown>
        </div>
      )}
    </>
  );
};
