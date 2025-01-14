'use client';
import { AutoComplete, Button, Input } from 'antd';
import Image from 'next/image';
import styles from './searchInput.module.css';
import { SearchInputProps } from './searchInput.props';
import classNames from 'classnames';
import React, { useState } from 'react';

export default function SearchInput({
  className,
}: SearchInputProps): React.ReactElement {
  // TODO доработать
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const handleSearchSelect = (value: string) => {
    setOptions(!value ? [] : [{ value }]);
    console.log('handleSearch', value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log('handleKeyDown');
    }
  };
  const onSelect = (value: string) => {
    console.log('onSelect', value);
  };

  return (
    <AutoComplete
      className={classNames([styles.search, className])}
      onSearch={handleSearchSelect}
      onSelect={onSelect}
      options={(options || []).map((option: any, index: number) => ({
        key: index,
        value: option.value,
        fias_id: option.fiasId,
      }))}
      onKeyDown={() => handleKeyDown}
    >
      <Input
        placeholder="Введите ФИО пользователя"
        prefix={<Image src="/search.svg" width={20} height={20} alt="search" />}
        suffix={<Button className="button-primary"> Найти</Button>}
      />
    </AutoComplete>
  );
}
