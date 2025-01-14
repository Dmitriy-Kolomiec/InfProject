import { Button, Input, Tooltip } from 'antd';
import styles from '../TableAddPositions.module.css';
import EditIcon from '@/public/editIcon.svg';
import SaveIcon from '@/public/saveCheck.svg';
import StopIcon from '@/public/stop.svg';
import { useState } from 'react';
import classNames from 'classnames';
import { getPopupContainer, notify } from '@/data/utils.common';
import { useDebouncedCallback } from 'use-debounce';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import axios from 'axios';

interface IProps {
  value: string;
  onSave: (newValue: string) => void;
}

interface IProductSelect {
  id: string;
  name: string;
}

export const EditableCell = ({ value, onSave }: IProps) => {
  const [isShowEditing, setIsShowEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(value || '');
  const [optionsSelect, setOptionsSelect] = useState<IProductSelect[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const debouncedFetchData = useDebouncedCallback(
    async (searchString: string) => {
      if (!searchString) {
        setOptionsSelect([]);
        setIsDropdownVisible(false);
        return;
      }
      try {
        const queryEncodedString = encodeURIComponent(searchString);
        const { data } = await APIRequest.get<any>(
          API_ENDPOINTS.SEARCH_BY_STRING(queryEncodedString),
        );
        setOptionsSelect(data.searchingResults || []);
        setIsDropdownVisible(true);
      } catch (error) {
        console.error('Ошибка:', error);
        if (axios.isAxiosError(error) && error.message) {
          notify('error', {
            message: error.message,
          });
        }
      }
    },
    300,
  );

  const handleSave = () => {
    onSave(inputValue.trim());
    setIsShowEditing(false);
    setIsDropdownVisible(false);
  };

  const handleCancel = () => {
    setInputValue(value);
    setIsShowEditing(false);
    setIsDropdownVisible(false);
  };

  const handleSelect = (selectedValue: string) => {
    setInputValue(selectedValue);
    setIsDropdownVisible(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    debouncedFetchData(value);
  };

  return (
    <>
      {isShowEditing || !value ? (
        <div className={styles.cellTable}>
          <div className={styles.inputWrapper}>
            <Input
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Введите значение"
              className={styles.input}
              onFocus={() => inputValue && setIsDropdownVisible(true)}
              onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
            />
            {isDropdownVisible && optionsSelect.length > 0 && (
              <div className={styles.dropdown}>
                {optionsSelect.map(option => (
                  <div
                    key={option.id}
                    className={styles.dropdownItem}
                    onClick={() => handleSelect(option.name)}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleSave}>
            <SaveIcon />
          </Button>
          {value && (
            <Button onClick={handleCancel}>
              <StopIcon />
            </Button>
          )}
        </div>
      ) : (
        <div className={styles.cellTable}>
          <span>{value}</span>
          <Tooltip title="Редактировать" getPopupContainer={getPopupContainer}>
            <Button
              className={classNames(['button-transparent', styles.buttonEdit])}
              onClick={() => setIsShowEditing(true)}
            >
              <EditIcon />
            </Button>
          </Tooltip>
        </div>
      )}
    </>
  );
};
