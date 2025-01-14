import { Title } from '@/app/components/Title/Title';
import styles from './modalUploadingDocs.module.css';
import { Button } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import LoadingTemplate from './components/LoadingTemplate';
import classNames from 'classnames';

interface IProps {
  hideModal: Dispatch<SetStateAction<boolean>>;
}

export default function ModalUploadingDocs({ hideModal }: IProps) {
  return (
    <div className={styles.containerModal}>
      <div>
        <Title className={styles.title} tag="h3">
          Загрузить список позиций
        </Title>
        <LoadingTemplate hideModal={hideModal} />
      </div>
      <Button
        className={classNames(['button-primary', styles.buttonSave])}
        onClick={() => hideModal(false)}
      >
        Закрыть
      </Button>
    </div>
  );
}
