import styles from './listOpenCharacteristic.module.css';
import { Button, Modal } from 'antd';
import { useCallback, useContext, useState } from 'react';
import EditIcon from '@/public/editIcon.svg';
import DeleteIcon from '@/public/deleteBgBlack.svg';
import { ModalDeleteCharacteristic } from './ModalDeleteCharacteristic ';
import ListChatacteristic from './ListCharacteristic';

import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  IProperties,
  IPropertyValue,
} from '@/interface/addingProduct/options.interface';
import { closeWindowOptions } from '../../../options.hook';

interface IProps {
  item: IProperties;
}

export default function ListOpenCharacteristic({ item }: IProps) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const { setShouldShowComponent } = useContext(ProductContext);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const showEditProperty = (propertyProductId: number) => {
    router.push(
      pathname +
        '?' +
        createQueryString('propertyEdit', `${propertyProductId}`),
    );
    closeWindowOptions('showEditProperties', setShouldShowComponent);
  };

  return (
    <div>
      {item && (
        <div className={styles.parameters}>
          <div>
            <span className={styles.titleParameter}>
              {item.property.name} {item.unit.name && `,${item.unit.name}`}
            </span>
            {item.propertyValues && (
              <div className={styles.valueList}>
                &nbsp;/
                {item.propertyValues.map((i: IPropertyValue, index) => (
                  <ListChatacteristic
                    key={index}
                    valueCharacteristic={i.value}
                    valueDescription={i.description}
                    item={item}
                  />
                ))}
              </div>
            )}
          </div>
          <div className={styles.interactionButton}>
            <Button
              className={'button-transparent'}
              onClick={() => showEditProperty(item.propertyProductId)}
            >
              <EditIcon />
            </Button>
            <Button
              className={'button-transparent'}
              onClick={() => setIsOpenDeleteModal(true)}
            >
              <DeleteIcon />
            </Button>
          </div>
        </div>
      )}
      <Modal
        open={isOpenDeleteModal}
        onCancel={() => setIsOpenDeleteModal(false)}
        centered
        className={styles.modalDelete}
        title="Удалить характеристику?"
        footer={null}
        width={480}
      >
        <ModalDeleteCharacteristic
          propertyProductId={item.propertyProductId}
          property={item.property.name}
          unit={item.unit.name}
          hideModal={setIsOpenDeleteModal}
        />
      </Modal>
    </div>
  );
}
