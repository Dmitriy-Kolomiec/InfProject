import { Title } from '../../../Title/Title';
import { ProductCategoryItem } from './ProductCategoryItem';
import { IAboutProperty, IPropertyChild } from '../../product.interface';
import styles from '../../product.module.css';
import NotificationIcon from '@/public/notification.svg';
import { Button } from 'antd';

interface Props {
  id: number;
  title: string;
  items?: IPropertyChild[];
  isValue?: boolean;
  onClickCategoryItem: (item: IPropertyChild) => void;
  property: any;
  openModalProperties: (value: IAboutProperty) => void;
  indexProperty: number;
}

export const ProductCategory: React.FC<Props> = props => {
  const {
    title,
    items,
    onClickCategoryItem,
    property,
    openModalProperties,
    indexProperty,
    id,
  } = props;

  return (
    <div key={`${id}__${title}`}>
      <div className={styles.titleCharacterisic} itemProp="category">
        <Title tag="h3">{title}</Title>
        {!!property.values[indexProperty]?.description && (
          <Button
            className="button-transparent"
            onClick={() => openModalProperties(property)}
          >
            <NotificationIcon />
          </Button>
        )}
      </div>

      <div className={styles.buttons}>
        {items?.map(item => {
          const { title, isSelected, isDisabled } = item;
          const onClick = (): void => {
            onClickCategoryItem(item);
          };

          return (
            <div key={item.key}>
              <ProductCategoryItem
                onClick={onClick}
                title={title}
                isSelected={isSelected}
                isDisabled={isDisabled}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
