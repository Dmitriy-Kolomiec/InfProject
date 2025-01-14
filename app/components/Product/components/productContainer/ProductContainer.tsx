import {
  INotPropertiesTree,
  IProduct,
  IPublicFileProperty,
} from '@/interface/publicPart/publicPart.interface';
import styles from '../../product.module.css';
import { ImagesContent } from '../images/ImagesContent';
import {
  IAboutProperty,
  IPropertyCategory,
  IPropertyChild,
  IPublicPartNumberTree,
  PropertiesTree,
} from '../../product.interface';
import { CharacteristicsSection } from './CharacteristicsSection';
import { DescriptionSection } from './CatalogNumbers';

interface IProps {
  dataProduct: IProduct;
  propertiesTree: PropertiesTree[] | INotPropertiesTree;
  partNumbers: IPublicPartNumberTree[] | undefined;
  aboutProduct: {
    id: number;
    name: string;
    description: string | null;
    additionalNames: string | null;
  };
  categories: IPropertyCategory[];
  openModalProperties: (value: IAboutProperty) => void;
  onClickCategoryItem: (item: IPropertyChild) => void;
  filesProperties: IPublicFileProperty[];
  openImages: (fileId?: number | undefined) => void;
}

export const ProductContainer = ({
  dataProduct,
  propertiesTree,
  partNumbers,
  aboutProduct,
  categories,
  openModalProperties,
  onClickCategoryItem,
  filesProperties,
  openImages,
}: IProps) => (
  <div
    className={styles.container}
    itemScope
    itemType="http://schema.org/Product"
  >
    <ImagesContent
      dataProduct={dataProduct}
      propertiesTree={propertiesTree}
      filesProperties={filesProperties}
      partNumbers={partNumbers}
      openImages={openImages}
    />
    <div className={styles.content}>
      <CharacteristicsSection
        dataProduct={dataProduct}
        categories={categories}
        propertiesTree={propertiesTree}
        openModalProperties={openModalProperties}
        onClickCategoryItem={onClickCategoryItem}
      />
      {aboutProduct.description && (
        <DescriptionSection description={aboutProduct.description} />
      )}
    </div>
  </div>
);
