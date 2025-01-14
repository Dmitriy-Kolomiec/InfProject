import { Title } from '@/app/components/Title/Title';
import styles from './modal.module.css';
import { renderHtml } from '@/data/utils.common';
import { IAboutProperty } from '@/app/components/Product/product.interface';

interface IProps {
  property: IAboutProperty | undefined;
}

export const DescriptionCharacteristic = ({ property }: IProps) => {
  return (
    <>
      <Title tag="h2">{property?.name}</Title>
      {property?.values.map(p => (
        <div key={p.id} className={styles.description}>
          <Title tag="h3">{p.value}</Title>
          <span>{renderHtml(p.description)}</span>
        </div>
      ))}
    </>
  );
};
