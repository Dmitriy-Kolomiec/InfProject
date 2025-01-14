'use client';
import classNames from 'classnames';
import styles from './category.module.css';
import { Button, Dropdown, Space } from 'antd';
import { Title } from '@/app/components/Title/Title';
import { Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';
import ArrowIcon from '@/public/arrowNext.svg';
import { IPublicCategory } from '@/interface/publicPart/publicPart.interface';
import { APP_PATHS } from '@/data/paths.data';

const INITIAL_CATEGORY_COUNT_TO_SHOW: number = 7;

interface IProps {
  category: IPublicCategory;
  hideDrawer?: Dispatch<SetStateAction<boolean>>;
}

export const Category = ({ category, hideDrawer }: IProps) => {
  const [isVisibleDropDown, setIsVisibleDropDown] = useState<boolean>(false);

  const onDropdown = (open: boolean) => {
    setIsVisibleDropDown(open);
  };

  const handleLinkClick = () => {
    setIsVisibleDropDown(false);
    hideDrawer?.(false);
  };

  const subCategories = category?.subCategories;

  const shortenedSubCategories = subCategories?.slice(
    0,
    INITIAL_CATEGORY_COUNT_TO_SHOW,
  );

  return (
    <div className={styles.container}>
      <Link
        href={APP_PATHS.PUBLIC_CATALOG(category.label)}
        className={classNames(['button-transparent', styles.title])}
        onClick={handleLinkClick}
      >
        <Title tag="h3">{category?.name}</Title>
        <div className={styles.icon}>
          <ArrowIcon />
        </div>
      </Link>
      {shortenedSubCategories?.map(item => {
        return (
          <Link
            href={APP_PATHS.PUBLIC_CATALOG(item.label)}
            key={item.id}
            className={styles.link}
            onClick={handleLinkClick}
          >
            {item.name}&nbsp;
            {!!item.count && `(${item.count})`}
          </Link>
        );
      })}

      {subCategories?.length > 7 && (
        <Dropdown
          dropdownRender={() => (
            <div className={styles.dropdown}>
              <Link
                href={APP_PATHS.PUBLIC_CATALOG(category.label)}
                className={classNames(['button-transparent', styles.title])}
                onClick={handleLinkClick}
              >
                <Title tag="h3">{category?.name}</Title>
                <ArrowIcon />
              </Link>
              <ul className={styles.dropdownList}>
                {category?.subCategories.map(item => (
                  <li key={item.id}>
                    <Link
                      href={APP_PATHS.PUBLIC_CATALOG(item.label)}
                      className={styles.link}
                      onClick={handleLinkClick}
                    >
                      <span>{item.name}</span>
                      <span className={styles.count}>
                        {!!item.count && `(${item.count})`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          onOpenChange={onDropdown}
          trigger={['click']}
          open={isVisibleDropDown}
          placement="topLeft"
        >
          <a onClick={e => e.preventDefault()}>
            <Space>
              <Button className={styles.button}>
                {isVisibleDropDown ? 'Закрыть' : 'Смотреть все'}
              </Button>
            </Space>
          </a>
        </Dropdown>
      )}
    </div>
  );
};
