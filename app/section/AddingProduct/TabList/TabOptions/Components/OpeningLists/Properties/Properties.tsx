import { useContext, useState } from 'react';
import { Button } from 'antd';
import styles from './properties.module.css';
import PageContent from '@/app/components/PageContent/PageContent';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import PlusIcon from '@/public/plus.svg';
import { Title } from '@/app/components/Title/Title';
import classNames from 'classnames';
import Image from 'next/image';
import AnimateHeight from 'react-animate-height';
import ListOpenCharacteristic from '../parameter/ListOpenCharacteristic';
import { IProperties } from '@/interface/addingProduct/options.interface';
import { closeWindowOptions } from '../../../options.hook';

interface IProps {
  properties?: IProperties[];
}

export default function Properties({ properties }: IProps) {
  const [isListOpenProperties, setIsListOpenProperties] =
    useState<boolean>(false);
  const { setShouldShowComponent, dataProduct } = useContext(ProductContext);
  const toggleListParameters = () => {
    setIsListOpenProperties(!isListOpenProperties);
  };
  const showAddCharacteristics = () => {
    closeWindowOptions('showAddingProperties', setShouldShowComponent);
  };

  return (
    <PageContent>
      <div className={styles.parameter}>
        <div className={styles.titleParameter} onClick={toggleListParameters}>
          {!!properties?.length && (
            <Button className="button-transparent">
              <Image
                className={classNames([styles.arrowIcon], {
                  [styles.arrowIconOpen]: isListOpenProperties,
                })}
                src="/arrow-down.svg"
                width={20}
                height={20}
                alt="icon"
              />
            </Button>
          )}
          <Title tag="h3">Характеристики</Title>
          {!!properties?.length && <span>({properties.length})</span>}
        </div>
        <Button className={styles.addButton} onClick={showAddCharacteristics}>
          <PlusIcon />
        </Button>
      </div>
      <AnimateHeight duration={300} height={isListOpenProperties ? 'auto' : 0}>
        <div>
          {dataProduct.properties?.map((item, index) => (
            <ListOpenCharacteristic key={index} item={item} />
          ))}
        </div>
      </AnimateHeight>
    </PageContent>
  );
}
