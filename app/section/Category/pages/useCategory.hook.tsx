import EditIcon from '@/public/editIcon.svg';
import DeleteIcon from '@/public/deleteBgBlack.svg';
import styles from './category.module.css';
import {
  Button,
  Form,
  MenuProps,
  TablePaginationConfig,
  TableProps,
} from 'antd';
import { useEffect, useState } from 'react';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { APP_PATHS } from '@/data/paths.data';
import Link from 'next/link';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import classNames from 'classnames';

type ColumnsType<T> = TableProps<T>['columns'];

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
}

export interface IProduct {
  id: number;
  name: string;
  description?: string;
  additionalNames?: string;
  index?: number;
}
export interface ITree {
  id: number;
  label: string;
  description?: string;
  parentId: number;
  name: string;
}

interface IProductList {
  categoryTree: ITree[];
  productList: IProduct[];
}
export const useHandlers = ({ alias }: { alias: string }) => {
  const [products, setProducts] = useState<IProductList>();
  const [isOpenDeleteProduct, setisOpenDeleteProduct] =
    useState<boolean>(false);
  const aboutCategory = products?.categoryTree.at(-1);
  const [selectProduct, setSelectProduct] = useState<{
    index?: number;
    id: number;
    name: string;
  }>();
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItemType[]>(
    [],
  );
  const [isOpenAboutCategory, setIsOpenAboutCategory] =
    useState<boolean>(false);
  const [isOpenDeleteCategory, setIsOpenDeleteCategory] =
    useState<boolean>(false);
  const router = useRouter();
  const isProduct = products?.productList.length;

  const [isLoader, setIsLoader] = useState<boolean>(true);

  const fetchDataProducts = async () => {
    try {
      const response = await APIRequest.get(
        API_ENDPOINTS.GET_PRODUCT_LIST(Number(alias)),
      );
      setProducts(response.data);
      setIsLoader(false);
    } catch (error) {
      console.log('Ошибка при получении списка продуктов:', error);
      router.push('/not-found');
    }
  };

  useEffect(() => {
    if (alias) {
      fetchDataProducts();
    }
  }, [alias]);

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      position: ['bottomCenter'],
      current: 1,
      pageSize: 10,
    },
  });

  const handleTableChange: TableProps<IProduct>['onChange'] = (
    pagination,
    filters,
    sorter,
  ) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };
  const deteleCategory = (value: any) => {
    setSelectProduct(value);
    setisOpenDeleteProduct(true);
  };

  const columns: ColumnsType<IProduct> = [
    {
      title: '№',
      dataIndex: 'index',
      key: '1',
      width: '3%',
      className: `${styles.id}`,
    },
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: '2',
      width: '90%',
    },
    {
      title: 'Действия',
      dataIndex: '',
      key: 'x',
      width: '7%',
      render: record => (
        <div className={styles.buttonActions}>
          <Link
            href={{
              pathname: APP_PATHS.EDIT_PRODUCT,
              query: {
                productId: `${record.id}`,
              },
            }}
            className={styles.editLink}
          >
            <EditIcon />
          </Link>
          <Button
            onClick={() => deteleCategory(record)}
            className={styles.deleteButton}
          >
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
  ];

  const dataTable: IProduct[] = [];
  if (products) {
    for (let i = 0; i < products.productList.length; i++) {
      dataTable.push({
        index: i + 1,
        id: products.productList[i].id,
        name: products.productList[i].name,
      });
    }
  }

  const itemsCategory: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button
          className="button-transparent"
          onClick={() => setIsOpenDrawerEditCategory(true)}
        >
          Редактировать
        </Button>
      ),
    },
    {
      key: '2',
      label: (
        <Button
          className={classNames(['button-transparent', styles.buttonDropdown])}
          onClick={e => {
            setIsOpenDeleteCategory(true);
          }}
        >
          Удалить
        </Button>
      ),
    },
  ];

  // Edit Category
  const [isDisabledFormCreateCategory, setIsDisabledFormCreateCategory] =
    useState<boolean>(true);
  const [formEditCategory] = Form.useForm();
  const [isOpenDrawerEditCategory, setIsOpenDrawerEditCategory] =
    useState<boolean>(false);

  const onCloseDrawer = () => {
    setIsOpenDrawerEditCategory(false);
  };

  const onFinishSubmitEditCategory = async (value: any, parentId?: number) => {
    const { name, label, description } = value;
    const requestBody = {
      id: aboutCategory?.id,
      parentId: aboutCategory?.parentId,
      label,
      name,
      description,
    };

    try {
      await APIRequest.put(API_ENDPOINTS.EDIT_CATEGORY, requestBody);
      formEditCategory.resetFields();
      fetchDataProducts();
      onCloseDrawer();
    } catch (error) {
      console.error('Ошибка при редактировании категории:', error);
    }
  };
  const onSubmitEditCategory = () => {
    formEditCategory.submit();
  };

  // Pagination
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pageSize: number = Number(searchParams.get('pageSize')) || 10;
  const page: number = Number(searchParams.get('page')) || 1;

  const handleChangeSelect = (value: string) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set('pageSize', String(value || 10));
    router.replace(`${pathname}?${queryParams.toString()}`, {
      scroll: false,
    });
  };
  // Изменение значения page через Пагинацию
  const onChangePage = (value: number) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set('page', String(value || 1));
    router.replace(`${pathname}?${queryParams.toString()}`);
  };

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const filteredData = dataTable.slice(startIndex, endIndex);

  return {
    tableParams,
    handleTableChange,
    columns,
    dataTable,
    products,
    aboutCategory,
    isOpenDeleteProduct,
    setisOpenDeleteProduct,
    selectProduct,
    fetchDataProducts,
    breadcrumbItems,
    setBreadcrumbItems,
    isOpenAboutCategory,
    setIsOpenAboutCategory,
    isOpenDeleteCategory,
    setIsOpenDeleteCategory,
    itemsCategory,
    isDisabledFormCreateCategory,
    setIsDisabledFormCreateCategory,
    formEditCategory,
    isOpenDrawerEditCategory,
    onCloseDrawer,
    onFinishSubmitEditCategory,
    onSubmitEditCategory,
    isProduct,
    isLoader,
    handleChangeSelect,
    onChangePage,
    filteredData,
    page,
    pageSize,
  };
};
