import { useState } from 'react';
import styles from './listOpenCharacteristic.module.css';
import { Modal } from 'antd';
import { ModalViewingCharacteristic } from './ModalViewingCharacteristic';
import { IProperties } from '@/interface/addingProduct/options.interface';

interface IProps {
  valueCharacteristic: string;
  valueDescription: string;
  item: IProperties;
}

export default function ListChatacteristic({
  valueCharacteristic,
  valueDescription,
  item,
}: IProps) {
  const [isOpenViewingModal, setIsOpenViewingModal] = useState<boolean>(false);

  return (
    <>
      <span className={styles.valueItem}>
        <span
          className={styles.value}
          onClick={() => setIsOpenViewingModal(true)}
        >
          {valueCharacteristic}
        </span>
      </span>
      <Modal
        open={isOpenViewingModal}
        onCancel={() => setIsOpenViewingModal(false)}
        centered
        className={styles.modalDelete}
        title="Описание значения характеристики"
        footer={null}
        width={480}
      >
        <ModalViewingCharacteristic
          property={item.property.name}
          valueCharacteristic={valueCharacteristic}
          description={valueDescription}
        />
      </Modal>
    </>
  );
}
