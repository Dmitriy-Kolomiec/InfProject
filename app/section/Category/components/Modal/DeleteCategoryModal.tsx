import { Button } from 'antd';
import styles from './modal.module.css';
import { Dispatch, SetStateAction } from 'react';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { useRouter } from 'next/navigation';
import { APP_PATHS } from '@/data/paths.data';
import axios from 'axios';
import { notify } from '@/data/utils.common';

interface IProps {
  id?: number;
  hideModal: Dispatch<SetStateAction<boolean>>;
}

export const DeleteCategory = ({ id, hideModal }: IProps) => {
  const router = useRouter();

  const onSubmitDeleteCategory = async (id: number) => {
    try {
      await APIRequest.delete(API_ENDPOINTS.DELETE_CATEGORY(id));
      hideModal(false);
      router.push(APP_PATHS.CATEGORIES);
    } catch (error) {
      console.error('Ошибка при удалении категории:', error);
      if (axios.isAxiosError(error) && error.message) {
        hideModal(false);
        notify('error', {
          message: error.message,
        });
      }
    }
  };

  return (
    <>
      {id && (
        <>
          <div>Вы действительно хотите удалить категорию ?</div>
          <div className={styles.buttonWrapper}>
            <Button
              className="button-transparent"
              onClick={() => hideModal(false)}
            >
              Не удалять
            </Button>
            <Button
              className="button-primary"
              onClick={() => onSubmitDeleteCategory(id)}
            >
              Удалить
            </Button>
          </div>
        </>
      )}
    </>
  );
};
