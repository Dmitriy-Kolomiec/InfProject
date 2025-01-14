import { useState } from 'react';
import styles from './listOpenVehicles.module.css';
import { Modal } from 'antd';
import { ModalViewingVehicles } from './ModalViewingVehicles';
import {
  IAutoModel,
  IAutoTypes,
} from '@/interface/addingProduct/options.interface';

interface IProps {
  model: IAutoModel;
  autoType: IAutoTypes;
  autoBrand: IAutoTypes;
}

export default function ListModels({ model, autoType, autoBrand }: IProps) {
  const [isOpenViewingModal, setIsOpenViewingModal] = useState<boolean>(false);
  const { name } = model;

  return (
    <>
      <span className={styles.valueItem}>
        <span
          className={styles.value}
          onClick={() => setIsOpenViewingModal(true)}
        >
          {name}
        </span>
      </span>
      <Modal
        open={isOpenViewingModal}
        onCancel={() => setIsOpenViewingModal(false)}
        centered
        className={styles.modalDelete}
        title="Описание транспортного средства"
        footer={null}
        width={480}
      >
        <ModalViewingVehicles
          autoBrand={autoBrand.name}
          autoType={autoType.name}
          autoModel={name}
        />
      </Modal>
    </>
  );
}
