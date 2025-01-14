import { Button } from 'antd';
import styles from './listOpenVehicles.module.css';
import { Dispatch, SetStateAction } from 'react';
import { IVehicle } from '@/interface/addingProduct/options.interface';

interface IProps {
  itemProps: IVehicle;
  hideModal: Dispatch<SetStateAction<boolean>>;
}

export const ModalDeleteVehicles = ({ itemProps, hideModal }: IProps) => {
  const { autoBrand, autoType } = itemProps;
  const deleteCharacteristic = (id: string) => {
    console.log('Удаление транспортного средства c id: ', id);
    hideModal(false);
  };
  return (
    <div className={styles.titleCharacteristic}>
      <div>
        <div className={styles.subtitle}>
          Вы удаляете транспортное средство:
        </div>
        <div className={styles.title}>
          {autoType.name} {autoBrand.name && `, ${autoBrand.name}`}
        </div>
      </div>
      <div>
        Вместе с транспортным средством будут удалены все добавленные модели.
      </div>

      <div className={styles.buttonWrapper}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
          Не удалять
        </Button>
        <Button
          className="button-primary"
          // onClick={() => deleteCharacteristic(id)}
        >
          Удалить
        </Button>
      </div>
    </div>
  );
};
