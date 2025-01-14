import NotificationDanger from '@/app/components/Notification/Danger';
import Page from '@/app/components/Page/Page';
import { Title } from '@/app/components/Title/Title';
import SelectGroup from './Components/Filters/SelectGroup';
import styles from './addingRelatedProduct.module.css';
import PageContent from '@/app/components/PageContent/PageContent';
import { Button } from 'antd';
import classNames from 'classnames';
import { Dispatch, SetStateAction, useState } from 'react';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { TreeRelations } from './Components/TreeRelations/TreeRelations';
import { IProduct } from '@/interface/addingProduct/product.interface';
import { ProductList } from './Components/ProductList/Productlist';
import { ITree } from '@/app/section/Category/pages/useCategory.hook';
import axios from 'axios';
import { notify } from '@/data/utils.common';
import { ITreeCategories } from '@/interface/addingProduct/connections.inteface';

interface IProps {
  hideModal: Dispatch<SetStateAction<boolean>>;
  setRelatedProduct: Dispatch<SetStateAction<IProduct[] | any>>;
  relatedProduct: IProduct[] | any;
  addRelation: (defaultValue?: any, insertIndex?: number | undefined) => void;
}

interface IProductList {
  categoryTree: ITree[];
  productList: IProduct[];
}
export default function AddingRelatedProduct({
  hideModal,
  setRelatedProduct,
  relatedProduct,
  addRelation,
}: IProps) {
  const [treeData, setTreeData] = useState<ITreeCategories[]>();
  const [products, setProducts] = useState<IProductList>();
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isDisplayTree, setIsDisplayTree] = useState<boolean>(false);
  const [isDisplayProducts, setIsDisplayProducts] = useState<boolean>(false);

  const fetchDataTree = async (params: string) => {
    setIsLoader(true);
    setIsDisplayTree(true);
    try {
      const { data } = await APIRequest.get(
        API_ENDPOINTS.GET_CATEGORIES_TREE(params),
      );
      setTreeData(data.tree);
      setIsLoader(false);
    } catch (error) {
      console.error('Ошибка при запросе дерева категорий:', error);
      if (axios.isAxiosError(error) && error.message) {
        setIsLoader(false);
        notify('error', {
          message: error.message,
        });
      }
    }
  };

  const fetchDataProducts = async (id: number) => {
    setIsDisplayProducts(true);
    try {
      const { data } = await APIRequest.get(API_ENDPOINTS.GET_PRODUCT_LIST(id));
      setProducts(data);
    } catch (error) {
      console.log('Ошибка при получении списка продуктов:', error);
      if (axios.isAxiosError(error) && error.message) {
        setIsLoader(false);
        notify('error', {
          message: error.message,
        });
      }
    }
  };

  const onSubmitFilter = (value: any) => {
    const params = {
      parameters: {
        autoBrandId: value.brand,
        autoTypeId: value.type,
        autoModelsIds: [value.model], // Передача id моделей происходит обязательно массивом, иначе поле будет проигнорированно
      },
    };
    // Преобразование объекта в JSON-строку
    const jsonString = JSON.stringify(params);
    // Кодирование JSON-строки для использования в URL
    const encodedString = encodeURIComponent(jsonString);
    fetchDataTree(encodedString);
  };

  const onSubmitRelatedProduct = () => {
    addRelation();
    hideModal(false);
  };

  return (
    <Page className={styles.container}>
      <Title tag="h3">Добавление связанного товара</Title>
      {!treeData && (
        <NotificationDanger
          text="Для добавления связанного товара, укажите модель транспортного средства, 
      затем выберите необходимую категорию товара, далее сам товар."
        />
      )}
      <SelectGroup handleSubmit={onSubmitFilter} isLoader={isLoader} />
      <div className={styles.flexContainer}>
        <PageContent>
          {isDisplayTree ? (
            <TreeRelations
              treeData={treeData}
              fetchDataProducts={fetchDataProducts}
            />
          ) : (
            <div className={styles.content}>
              <Title tag="h3">Категории</Title>
              <div className={styles.text}>
                Укажите транспортное средство, чтобы увидеть дерево категорий.
              </div>
            </div>
          )}
        </PageContent>
        <PageContent>
          {isDisplayProducts ? (
            <ProductList
              productList={products?.productList}
              setRelatedProduct={setRelatedProduct}
            />
          ) : (
            <div className={styles.content}>
              <Title tag="h3">Товары</Title>
              <div className={styles.text}>
                Выберите категорию, чтобы увидеть список товаров.
              </div>
            </div>
          )}
        </PageContent>
      </div>
      <div className={styles.buttonWrapper}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
          Отмена
        </Button>
        <Button
          htmlType="submit"
          className={classNames([styles.button, 'button-primary'])}
          onClick={onSubmitRelatedProduct}
          disabled={!relatedProduct}
        >
          Сохранить
        </Button>
      </div>
    </Page>
  );
}
