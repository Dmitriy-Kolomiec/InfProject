import styles from './replacementProduct.module.css';
import ExtarnalLinkIcon from '@/public/extarnalLink.svg';
import { Button } from 'antd';
import classNames from 'classnames';
import { IPublicProperty } from '@/interface/publicPart/publicPart.interface';
import { IPropertyPartNumber } from '@/interface/request/request.interface';

interface IProps {
  properties: IPropertyPartNumber[];
  openModalProduct: () => void;
}

export const ReplacementProductModal = ({
  properties,
  openModalProduct,
}: IProps) => {
  console.log('properties', properties);
  return (
    <>
      <div>
        {!!properties[0].property.name && (
          <>
            <span className={styles.characteristics}>Характеристики</span>
            <ul className={styles.list}>
              {properties.map(item => {
                return (
                  <li key={item.property.id}>
                    <div className={styles.titleParameter}>
                      {item.property.name}
                      {item.unit.name && `,${item.unit.name}`}
                    </div>
                    {!!item.propertyValue.value && (
                      <span className={styles.valueItem}>
                        <span className={styles.value}>
                          / {item.propertyValue.value}
                        </span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
      <Button
        className={classNames(['button-white', styles.button])}
        onClick={openModalProduct}
      >
        Открыть карточку товара
        <ExtarnalLinkIcon />
      </Button>
    </>
  );
};
