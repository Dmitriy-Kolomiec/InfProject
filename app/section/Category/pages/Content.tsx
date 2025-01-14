'use client';
import { CategoryProps } from './category.props';
import PageContent from '@/app/components/PageContent/PageContent';
import Link from 'next/link';
import { Title } from '@/app/components/Title/Title';
import { Breadcrumb, Button, Drawer, Dropdown, Modal, Spin, Table } from 'antd';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { APP_PATHS } from '@/data/paths.data';
import { IProduct, ITree, useHandlers } from './useCategory.hook';
import styles from './category.module.css';
import PlusIcon from '@/public/plus.svg';
import NotificationIcon from '@/public/notification.svg';
import EllipsisIcon from '@/public/ellipsis.svg';
import classNames from 'classnames';
import { useEffect } from 'react';
import { AboutCategoryModal } from '../components/Modal/AboutCategoryModal';
import { DeleteProductModal } from '../components/Modal/DeleteProductModal';
import { DeleteCategory } from '../components/Modal/DeleteCategoryModal';
import CloseIcon from '@/public/close.svg';
import { DrawerEditCategory } from '../../Categories/components/DrawerCategory/DrawerEditCategory';
import { getPopupContainer } from '@/data/utils.common';
import { LoadingOutlined } from '@ant-design/icons';
import { CustomPagination } from '@/app/components/Pagination/Pagination';

export default function CategoryPageContent({
  alias,
  className,
  ...props
}: CategoryProps): React.ReactElement {
  const {
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
  } = useHandlers({ alias });

  useEffect(() => {
    if (products?.categoryTree) {
      const createBreadcrumbItems = (categories: ITree[]) => {
        const items: BreadcrumbItemType[] = [
          {
            title: (
              <Link className="bread-crumb_link" href={APP_PATHS.CATEGORIES}>
                Категории
              </Link>
            ),
          },
        ];

        let currentCategory = categories.find(
          category => category.parentId === null,
        );
        while (currentCategory) {
          const isLast = !categories.some(
            category => category.parentId === currentCategory?.id,
          );
          items.push({
            title: isLast ? (
              <span className="bread-crumb_item">{currentCategory.name}</span>
            ) : (
              <Link
                href={APP_PATHS.CATEGORY(currentCategory.id)}
                className="bread-crumb_link"
              >
                {currentCategory.name}
              </Link>
            ),
          });
          currentCategory = categories.find(
            category => category.parentId === currentCategory?.id,
          );
        }

        return items;
      };

      setBreadcrumbItems(createBreadcrumbItems(products.categoryTree));
    }
  }, [products?.categoryTree]);

  return (
    <>
      <Breadcrumb className="bread-crumb" items={breadcrumbItems} />
      <div className={styles.title}>
        {!!products?.categoryTree ? (
          <Title tag="h2">{aboutCategory?.name}</Title>
        ) : (
          <div></div>
        )}
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.button}
            onClick={() => setIsOpenAboutCategory(true)}
          >
            <NotificationIcon />
            <span>Описание категории</span>
          </Button>
          {!!isProduct && (
            <Link
              href={APP_PATHS.ADD_PRODUCT}
              className={classNames(['button-primary', styles.addButton])}
            >
              <PlusIcon />
              <span>Добавить товар</span>
            </Link>
          )}
          <Dropdown
            getPopupContainer={getPopupContainer}
            className={styles.dropdown}
            menu={{
              items: itemsCategory,
            }}
          >
            <EllipsisIcon />
          </Dropdown>
        </div>
      </div>
      <PageContent {...props}>
        {isLoader ? (
          <div className={styles.loader}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        ) : (
          <>
            {!!isProduct ? (
              <>
                <Table
                  size="middle"
                  showSorterTooltip={false}
                  rowKey={record => record.id}
                  columns={columns}
                  dataSource={filteredData}
                  pagination={false}
                  bordered
                  onChange={handleTableChange}
                />
                {dataTable && dataTable.length > 10 && (
                  <CustomPagination<IProduct>
                    data={dataTable}
                    page={page}
                    pageSize={pageSize}
                    onChange={onChangePage}
                    onChangeSelect={handleChangeSelect}
                  />
                )}
              </>
            ) : (
              <PageContent className={styles.notProducts}>
                <div>
                  <Title tag="h3">Товары не добавлены</Title>
                  <div>
                    <div className={styles.text}>
                      Здесь будут расположены добавленные вами товары.
                    </div>
                    <div className={styles.addValueButton}>
                      <Link
                        href={APP_PATHS.ADD_PRODUCT}
                        className={classNames([
                          'button-primary',
                          styles.addButton,
                        ])}
                      >
                        <PlusIcon />
                        <span>Добавить товар</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </PageContent>
            )}
          </>
        )}
      </PageContent>
      <Modal
        open={isOpenAboutCategory}
        onCancel={() => setIsOpenAboutCategory(false)}
        centered
        className={styles.modalDelete}
        title={aboutCategory?.name}
        footer={null}
        width={720}
      >
        <AboutCategoryModal
          aboutCategory={aboutCategory}
          locationTree={products?.categoryTree}
        />
      </Modal>
      <Modal
        open={isOpenDeleteCategory}
        onCancel={() => setIsOpenDeleteCategory(false)}
        centered
        title={`Удалить категорию ${aboutCategory?.name}`}
        footer={null}
        width={480}
      >
        <DeleteCategory
          id={aboutCategory?.id}
          hideModal={setIsOpenDeleteCategory}
        />
      </Modal>
      <Modal
        open={isOpenDeleteProduct}
        onCancel={() => setisOpenDeleteProduct(false)}
        centered
        className={styles.modalDelete}
        title={selectProduct?.name}
        footer={null}
        width={420}
      >
        <DeleteProductModal
          hideModal={setisOpenDeleteProduct}
          productId={selectProduct?.id}
          fetchDataProducts={fetchDataProducts}
        />
      </Modal>
      <Drawer
        onClose={onCloseDrawer}
        open={isOpenDrawerEditCategory}
        width={480}
        title="Редактирование категории"
        closeIcon={false}
        extra={
          <Button className="button-transparent" onClick={onCloseDrawer}>
            <CloseIcon />
          </Button>
        }
        footer={
          <Button
            className={classNames(['button-primary', styles.buttonSave])}
            htmlType="submit"
            onClick={onSubmitEditCategory}
            disabled={isDisabledFormCreateCategory}
          >
            Сохранить
          </Button>
        }
      >
        <DrawerEditCategory
          form={formEditCategory}
          onFinish={onFinishSubmitEditCategory}
          setIsDisabled={setIsDisabledFormCreateCategory}
          name={aboutCategory?.name}
          label={aboutCategory?.label}
          description={aboutCategory?.description}
        />
      </Drawer>
    </>
  );
}
