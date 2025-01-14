import { Button } from 'antd';
import styles from './modal.module.css';
import { Dispatch, SetStateAction } from 'react';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { ITreeRow } from '../../useTreeCategories.hook';
import axios from 'axios';
import { notify } from '@/data/utils.common';

interface IProps {
  category: ITreeRow;

  hideModal: Dispatch<SetStateAction<boolean>>;
  fetchDataTree: (params: string) => Promise<void>;
  paramsFilter: string;
}

export const DeleteCategory = ({
  category,
  hideModal,
  fetchDataTree,
  paramsFilter,
}: IProps) => {
  const deleteCategory = async (id: number) => {
    try {
      await APIRequest.delete(API_ENDPOINTS.DELETE_CATEGORY(id));
      fetchDataTree(paramsFilter);
      hideModal(false);
    } catch (error) {
      console.error('Ошибка удаления категории:', error);
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
      <div>
        Вы действительно хотите удалить категорию «{category.name}»? Вместе с
        ней будут удалены все её подкатегории ({category.subCategories || 0}) и
        вложенные товары ({category.count}).
      </div>
      <div className={styles.buttonWrapper}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
          Не удалять
        </Button>
        <Button
          className="button-primary"
          onClick={() => deleteCategory(category.id)}
        >
          Удалить
        </Button>
      </div>
    </>
  );
};
