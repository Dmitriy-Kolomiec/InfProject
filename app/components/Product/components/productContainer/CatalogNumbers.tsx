import { INotPropertiesTree } from '@/interface/publicPart/publicPart.interface';
import { PropertiesTree } from '../../product.interface';
import styles from '../../product.module.css';
import { Title } from '@/app/components/Title/Title';
import { renderHtml } from '@/data/utils.common';

interface IPropsPartNumbers {
  propertiesTree: PropertiesTree[] | INotPropertiesTree;
}

export const CatalogNumbers = ({ propertiesTree }: IPropsPartNumbers) => (
  <div>
    <span className={styles.partNumberTitle}>Каталожный номер</span>
    {!Array.isArray(propertiesTree) && (
      <ul className={styles.ListPartNumbers}>
        {propertiesTree.partNumbers.map((partNumber, index) => (
          <li
            key={`${partNumber.id}_${index}`}
            className={styles.partNumber}
            itemProp="mpn"
          >
            {partNumber.title};
          </li>
        ))}
      </ul>
    )}
  </div>
);

interface IPropsDescription {
  description: string;
}
export const DescriptionSection = ({ description }: IPropsDescription) => (
  <div className={styles.description}>
    <Title tag="h3">Описание</Title>
    <span itemProp="description">{renderHtml(description)}</span>
  </div>
);
