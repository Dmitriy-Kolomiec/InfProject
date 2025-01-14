'use client';
import { Button, Input } from 'antd';
import styles from './searchProduct.module.css';
import { useCallback, useState } from 'react';
import SearchIcon from '@/public/search.svg';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import React from 'react';
import { APP_PATHS } from '@/data/paths.data';
import classNames from 'classnames';

interface IProps {
  initialValue?: string;
  onCloseDrawer?: () => void;
}

export const SearchProduct = ({ initialValue, onCloseDrawer }: IProps) => {
  const [searchString, setSearchString] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const debouncedSetSearchString = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    200,
  );

  // Добавление query params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
  const handleSearch = () => {
    router.push(
      APP_PATHS.SEARCH + '?' + createQueryString('search', `${searchString}`),
    );
    onCloseDrawer?.();
  };

  return (
    <Input
      className={styles.input}
      placeholder="Введите название позиции или артикул"
      prefix={
        <Button
          onClick={handleSearch}
          className={classNames(['button-transparent', styles.searchButton])}
        >
          <SearchIcon />
        </Button>
      }
      onChange={e => {
        debouncedSetSearchString(e);
      }}
      onPressEnter={handleSearch}
      defaultValue={initialValue}
    />
  );
};
