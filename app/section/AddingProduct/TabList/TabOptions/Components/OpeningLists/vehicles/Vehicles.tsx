import styles from './vehicles.module.css';
import { useContext, useState } from 'react';
import { Button } from 'antd';
import PageContent from '@/app/components/PageContent/PageContent';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import PlusIcon from '@/public/plus.svg';
import { Title } from '@/app/components/Title/Title';
import classNames from 'classnames';
import Image from 'next/image';
import AnimateHeight from 'react-animate-height';
import ListOpenVehicles from './ListOpenVehicles';
import { IVehicle } from '@/interface/addingProduct/options.interface';
import { closeWindowOptions } from '../../../options.hook';

interface IProps {
  vehicle?: IVehicle[];
}

export default function Vehicles({ vehicle }: IProps) {
  const [isListOpenVehicles, setIsListOpenVehicles] = useState<boolean>(false);
  const { setShouldShowComponent } = useContext(ProductContext);
  const toggleListVehicles = () => {
    setIsListOpenVehicles(!isListOpenVehicles);
  };

  const showAddVehicles = () => {
    closeWindowOptions('showAddingVehicle', setShouldShowComponent);
  };

  return (
    <PageContent>
      <div className={styles.parameter}>
        <div className={styles.titleParameter} onClick={toggleListVehicles}>
          {!!vehicle?.length && (
            <Button className="button-transparent">
              <Image
                className={classNames([styles.arrowIcon], {
                  [styles.arrowIconOpen]: isListOpenVehicles,
                })}
                src="/arrow-down.svg"
                width={20}
                height={20}
                alt="icon"
              />
            </Button>
          )}
          <Title tag="h3">Транспортные средства</Title>
          {!!vehicle?.length && <span>({vehicle.length})</span>}
        </div>

        <Button className={styles.addButton} onClick={showAddVehicles}>
          <PlusIcon />
        </Button>
      </div>
      <AnimateHeight duration={300} height={isListOpenVehicles ? 'auto' : 0}>
        <div>
          {vehicle?.map((item, index) => (
            <ListOpenVehicles key={index} item={item} />
          ))}
        </div>
      </AnimateHeight>
    </PageContent>
  );
}
