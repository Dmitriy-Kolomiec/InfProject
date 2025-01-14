import { Title } from '@/app/components/Title/Title';
import styles from '../../product.module.css';
import { ProductCategory } from '../productCategory/ProductСategory';
import {
  INotPropertiesTree,
  IProduct,
} from '@/interface/publicPart/publicPart.interface';
import {
  IAboutProperty,
  IPropertyCategory,
  IPropertyChild,
  PropertiesTree,
} from '../../product.interface';
import { CatalogNumbers } from './CatalogNumbers';

interface IProps {
  dataProduct: IProduct;
  propertiesTree: PropertiesTree[] | INotPropertiesTree;
  categories: IPropertyCategory[];
  openModalProperties: (value: IAboutProperty) => void;
  onClickCategoryItem: (item: IPropertyChild) => void;
}

export const CharacteristicsSection = ({
  dataProduct,
  categories,
  propertiesTree,
  openModalProperties,
  onClickCategoryItem,
}: IProps) => (
  <div className={styles.characteristics} itemProp="additionalProperty">
    <Title tag="h2">{dataProduct.product.name}</Title>
    {dataProduct.properties.length ? (
      dataProduct.properties.map(({ property }, index) => {
        const { id, name, values } = property;
        const category = categories.find(cat => cat.id === id);
        const items = values.map(({ id, value }) => ({
          ...(category?.children?.find(cat => cat.id === id) || {
            id,
            title: value,
            isDisabled: true,
          }),
        }));
        return (
          <ProductCategory
            key={`${id}_${index}`}
            property={property}
            items={items}
            openModalProperties={openModalProperties}
            id={id}
            title={name}
            onClickCategoryItem={onClickCategoryItem}
            indexProperty={index}
          />
        );
      })
    ) : (
      <CatalogNumbers propertiesTree={propertiesTree} />
    )}
  </div>
);
