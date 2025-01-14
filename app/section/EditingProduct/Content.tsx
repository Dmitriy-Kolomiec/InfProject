'use client';
import React, { useContext, useEffect } from 'react';
import { EditProductProps } from './editProduct.props';
import classNames from 'classnames';
import styles from './editProduct.module.css';
import { Title } from '@/app/components/Title/Title';
import { ITabList } from '@/app/components/TabList/tabList.props';
import TabList from '@/app/components/TabList/TabList';
import { usePathname, useSearchParams } from 'next/navigation';
import PageContent from '@/app/components/PageContent/PageContent';
import { Breadcrumb } from 'antd';
import { APP_PATHS } from '@/data/paths.data';
import Link from 'next/link';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { API_ENDPOINTS } from '@/data/api/api.data';
import SwitchDisplayButton from '../AddingProduct/TabList/CatalogNumbers/Components/SwitchButton/SwitchDisplayButton';
import AddProductPageContentTabs from '../AddingProduct/TabList/Tabs';
import APIRequest from '@/data/api/api.utils';
import { IDataProduct } from '@/interface/addingProduct/product.interface';
import { EditingWindows } from './EditingWindows';
import { useRouter } from 'next/navigation';

const TAB_LIST: ITabList[] = [
  { title: 'Описание', nameQuery: 'description' },
  { title: 'Параметры', nameQuery: 'options' },
  { title: 'Каталожные номера', nameQuery: 'partnumbers' },
  { title: 'Связи', nameQuery: 'relations' },
];

export default function EditProductPageContent({
  className,
  ...props
}: EditProductProps): React.ReactElement {
  const searchParams = useSearchParams();
  const activeTab: string | null = searchParams.get('tab');
  const catalogNumberLayout: string | null = searchParams.get('layout');
  const productId: string | null = searchParams.get('productId');
  const router = useRouter();
  const pathname = usePathname();

  const displayNotPartNumbers: string | null = searchParams.get(
    'displayNotPartNumbers',
  );
  const displayLayout = (value: string) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set('layout', String(value));
    router.replace(`${pathname}?${queryParams.toString()}`);
  };

  const {
    dataProduct,
    shouldShowComponent,
    setShouldShowComponent,
    setDataProduct,
  } = useContext(ProductContext);
  useEffect(() => {
    setShouldShowComponent(state => ({
      ...state,
      showAddingCategory: false,
      showEditCategory: false,
      showAddingProperties: false,
      showEditProperties: false,
      showAddingVehicle: false,
      showEditVehicle: false,
      showAddingRelations: false,
    }));
  }, [activeTab, setShouldShowComponent]);

  useEffect(() => {
    const fetchDataProduct = async () => {
      try {
        const res = await APIRequest.get<IDataProduct>(
          API_ENDPOINTS.EDIT_PRODUCT(productId as string),
        );
        const data = res.data;

        const updatedCategories = data.categories?.map((category: any) => ({
          productCategoryId: category.productCategoryId,
          categories: category.categories.map((subCategory: any) => ({
            id: subCategory.id,
            label: subCategory.label,
            name: subCategory.name,
            parentId: subCategory.parentId,
          })),
        }));

        console.log('Редактируемый продукт полученный с сервера: ', data);

        setDataProduct(state => ({
          ...state,
          product: {
            id: data.product.id,
            name: data.product.name,
            additionalNames: data.product.additionalNames,
            description: data.product.description,
            files: data.product.files,
          },
          categories: updatedCategories,
          properties: data.properties,
          vehicle: data.vehicle,
          partNumbers: data.partNumbers,
          connections: data.connections,
        }));
      } catch (error) {
        console.log('Ошибка:', error);
        router.push(APP_PATHS.CATEGORIES);
      }
    };
    fetchDataProduct();
  }, [productId, dataProduct.product?.name, setDataProduct]);

  return (
    <div
      className={classNames([className, styles.container], {
        [styles.fullWidth]: activeTab === 'partnumbers',
      })}
      {...props}
    >
      <div>
        <Breadcrumb
          className="bread-crumb"
          items={[
            {
              title: (
                <Link className="bread-crumb_link" href={APP_PATHS.CATEGORIES}>
                  Категории
                </Link>
              ),
            },
            {
              title: (
                <span className="bread-crumb_item">Редактирование товара</span>
              ),
            },
          ]}
        />
        <Title tag="h2">{dataProduct.product?.name}</Title>
        <div
          className={classNames({
            [styles.layoutCatalogNumbers]: activeTab === 'partnumbers',
          })}
        >
          <PageContent className={styles.tabContainer}>
            <TabList
              activeTab={activeTab || 'description'}
              tabList={TAB_LIST}
              productID={productId! || dataProduct.product.id}
            />
          </PageContent>
          {!!dataProduct.partNumbers?.length && activeTab === 'partnumbers' && (
            <SwitchDisplayButton
              active={catalogNumberLayout}
              setDisplayLayout={displayLayout}
              isDisabled={
                displayNotPartNumbers === 'true' ||
                !dataProduct.properties?.length
              }
            />
          )}
        </div>

        <AddProductPageContentTabs activeTab={activeTab} />
      </div>
      <EditingWindows shouldShowComponent={shouldShowComponent} />
    </div>
  );
}
