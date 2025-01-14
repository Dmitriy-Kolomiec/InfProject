import { Button } from 'antd';
import styles from './modal.module.css';
import { MouseEventHandler } from 'react';
import classNames from 'classnames';

interface IProps {
  hideModal: MouseEventHandler<HTMLElement>;
}

export const ModalOrderSuccessful = ({ hideModal }: IProps) => {
  return (
    <>
      <span>
        Ваш заказ оформлен, наши менеджеры свяжутся с Вами в ближайшее время.
      </span>

      <Button
        className={classNames(['button-primary', styles.button])}
        onClick={hideModal}
      >
        Закрыть
      </Button>
    </>
  );
};
