import { Button } from 'antd';
import styles from './categories.module.css';
import ListOpenCategory from './components/ListOpenCategories';
import EditIcon from '@/public/editIcon.svg';
import PlusIcon from '@/public/plus.svg';
import DeleteIcon from '@/public/deleteBgBlack.svg';
import PageContent from '@/app/components/PageContent/PageContent';
import Image from 'next/image';
import { useContext, useState } from 'react';
import classNames from 'classnames';
import { Title } from '@/app/components/Title/Title';
import AnimateHeight from 'react-animate-height';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { ICategories } from '@/interface/addingProduct/options.interface';
import { closeWindowOptions } from '../../../options.hook';

interface IProps {
  categories?: ICategories[];
  deleteCategory: (item: any) => void;
}

export const Categories = ({ categories, deleteCategory }: IProps) => {
  const [isListOpenCategory, setIsListOpenCategory] = useState<boolean>(false);
  const { setShouldShowComponent } = useContext(ProductContext);
  const toggleListCategory = () => {
    setIsListOpenCategory(!isListOpenCategory);
  };
  const showAddingCategory = () => {
    closeWindowOptions('showAddingCategory', setShouldShowComponent);
  };

  return (
    <PageContent>
      <div className={styles.parameter}>
        <div className={styles.titleParameter} onClick={toggleListCategory}>
          {!!categories?.length && (
            <Button className="button-transparent">
              <Image
                className={classNames([styles.arrowIcon], {
                  [styles.arrowIconOpen]: isListOpenCategory,
                })}
                src="/arrow-down.svg"
                width={20}
                height={20}
                alt="icon"
              />
            </Button>
          )}
          <Title tag="h3">Категории</Title>
          {!!categories?.length && <span>({categories.length})</span>}
        </div>
        <Button className={styles.addButton} onClick={showAddingCategory}>
          <PlusIcon />
        </Button>
      </div>
      <AnimateHeight duration={300} height={isListOpenCategory ? 'auto' : 0}>
        <div>
          {categories?.map((item: ICategories) => {
            return (
              <div key={item.productCategoryId} className={styles.openList}>
                <div className={styles.flexContainer}>
                  <ListOpenCategory
                    categories={item.categories}
                    id={item.productCategoryId}
                  />
                </div>
                <div className={styles.interactionButton}>
                  <Button
                    className={'button-transparent'}
                    // onClick={showEditCategory}
                    onClick={() => alert('Делаем.... ')}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    className={'button-transparent'}
                    onClick={() => deleteCategory(item)}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </AnimateHeight>
    </PageContent>
  );
};
