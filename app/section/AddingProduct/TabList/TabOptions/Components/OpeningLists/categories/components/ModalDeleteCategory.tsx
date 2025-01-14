import { Button } from 'antd';
import styles from './listOpenCategory.module.css';
import { Dispatch, SetStateAction, useContext } from 'react';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { OpenCategory } from './OpenCategory';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { ICategories } from '@/interface/addingProduct/options.interface';
import axios from 'axios';
import { notify } from '@/data/utils.common';

interface IProps {
  categories?: ICategories;

  hideModal: Dispatch<SetStateAction<boolean>>;
}

export const ModalDeleteCategoryProduct = ({
  categories,
  hideModal,
}: IProps) => {
  const { setDataProduct } = useContext(ProductContext);

  const deleteCategory = async (id: string) => {
    try {
      await APIRequest.delete(API_ENDPOINTS.DELETE_CATEGORY_PRODUCT(id));

      setDataProduct(state => ({
        ...state,
        categories: state.categories?.filter(
          (item: ICategories) => item.productCategoryId !== id,
        ),
      }));
      hideModal(false);
    } catch (error) {
      console.error('Error:', error);
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
      <div className={styles.subtitle}>Вы удаляете категорию:</div>
      <div className={styles.nameCategory}>
        {categories?.categories.map((category: any) => {
          return (
            <div key={category.id} className={styles.titleCategories}>
              <OpenCategory {...category} />
            </div>
          );
        })}
      </div>
      <div className={styles.buttonWrapper}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
          Не удалять
        </Button>
        <Button
          className="button-primary"
          onClick={() => deleteCategory(categories!.productCategoryId)}
        >
          Удалить
        </Button>
      </div>
    </>
  );
};
