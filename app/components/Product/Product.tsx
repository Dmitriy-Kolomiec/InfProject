'use client';
import styles from './product.module.css';
import { Modal, Spin } from 'antd';
import { DescriptionCharacteristic } from '../../section/Request/TabList/OrderFormation/components/modals/DescriptionCharacteristic';
import classNames from 'classnames';
import PageContent from '../PageContent/PageContent';
import {
  INotPropertiesTree,
  IProduct,
} from '@/interface/publicPart/publicPart.interface';
import Breadcrumb, { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { TablePartNumbers } from './components/tablePartNumbers/TablePartNumbers';
import { Applicability } from './components/applicability/Applicability';
import { ImagesModal } from './components/imagesModal/ImagesModal';
import { SearchProduct } from '@/app/section/Catalogs/components/searchProduct/SearchProduct';
import { PropertiesTree } from './product.interface';
import { useProduct } from './useProduct.hook';
import { TableAvailableProducts } from './components/tableAvailableProducts/TableAvailableProducts';
import { ProductContainer } from './components/productContainer/ProductContainer';
import { IProductCardModal } from '@/interface/request/request.interface';
import { Dispatch, SetStateAction } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { TableOffers } from './components/tableOffers/TableOffers';

interface IProps {
  dataProduct: IProduct;
  breadcrumbItems?: BreadcrumbItemType[];
  propertiesTree: PropertiesTree[] | INotPropertiesTree;
  modalWindow?: boolean;
  dataOffers?: IProductCardModal | undefined;
  partNumberIdModal?: string;
  setPartNumberIdsModal?: Dispatch<SetStateAction<number[]>>;
  loadingDataOffers?: boolean;
}

export const Product = ({
  dataProduct,
  breadcrumbItems,
  propertiesTree,
  modalWindow = false,
  dataOffers,
  partNumberIdModal,
  setPartNumberIdsModal,
  loadingDataOffers,
}: IProps) => {
  const {
    isOpenModalImages,
    setIsOpenModalImages,
    selectedImage,
    filesProperties,
    aboutProperty,
    isOpenModalDescription,
    setIsOpenModalDescription,
    dataPartNumbers,
    categories,
    partNumbers,
    onClickCategoryItem,
    openModalProperties,
    openImages,
    isAuth,
    availableProducts,
  } = useProduct({
    propertiesTree,
    dataProduct,
    partNumberIdModal,
    setPartNumberIdsModal,
    modalWindow,
  });
  const aboutProduct = dataProduct.product;

  return (
    <>
      {!modalWindow && <SearchProduct />}
      {breadcrumbItems && (
        <Breadcrumb
          className={classNames(['bread-crumb', styles.breadcrumb])}
          items={breadcrumbItems}
        />
      )}
      <PageContent>
        <ProductContainer
          dataProduct={dataProduct}
          propertiesTree={propertiesTree}
          partNumbers={partNumbers}
          aboutProduct={aboutProduct}
          categories={categories}
          openModalProperties={openModalProperties}
          onClickCategoryItem={onClickCategoryItem}
          filesProperties={filesProperties}
          openImages={openImages}
        />
      </PageContent>
      {/* content for page product */}
      {!modalWindow && (
        <>
          {!!dataPartNumbers?.partNumbers.length && (
            <TablePartNumbers
              dataTable={dataPartNumbers?.partNumbers}
              mainProduct={{
                name: aboutProduct.name,
                id: aboutProduct.id,
              }}
            />
          )}

          {!!dataPartNumbers?.autoModels.length && (
            <Applicability autoModels={dataPartNumbers.autoModels} />
          )}
          {isAuth && !!availableProducts?.length && (
            <TableAvailableProducts dataTable={availableProducts} />
          )}
        </>
      )}
      {/* Content for modal window */}
      {!loadingDataOffers ? (
        <>
          {!!dataOffers?.offers?.length && (
            <TableOffers dataTable={dataOffers.offers} />
          )}
          {!!dataOffers?.autoModels?.length && (
            <Applicability autoModels={dataOffers.autoModels} />
          )}
        </>
      ) : (
        <div className={styles.loader}>
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      )}
      <Modal
        open={isOpenModalImages}
        onCancel={() => setIsOpenModalImages(false)}
        centered
        footer={null}
        width="60%"
        title={aboutProduct.name}
        className={styles.imagesModal}
      >
        <ImagesModal
          categories={categories}
          nameProduct={aboutProduct.name}
          fileId={selectedImage}
          files={filesProperties?.length ? filesProperties : dataProduct.files}
        />
      </Modal>
      <Modal
        open={isOpenModalDescription}
        onCancel={() => setIsOpenModalDescription(false)}
        centered
        footer={null}
        width="70%"
      >
        <DescriptionCharacteristic property={aboutProperty} />
      </Modal>
    </>
  );
};
