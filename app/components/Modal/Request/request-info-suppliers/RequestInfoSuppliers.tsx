import { Button } from 'antd';
import styles from '../modal.module.css';
import { Title } from '../../../Title/Title';
import { RequestInfoSuppliersProps } from './RequestInfoSuppliers.props';

export default function RequestInfoSuppliers({
  setIsOpenModalResTimes,
  setIsOpenModalReqInfoSuppliers,
  className,
  ...props
}: RequestInfoSuppliersProps) {
  return (
    <div className={className} {...props}>
      <Title tag="h3" className={styles.titleModal}>
        Запросить информацию у поставщиков?
      </Title>
      <span>
        Поставщикам, позиции которых требуют уточнения, будут отправлены
        уведомления. Максимальный срок ответа поставщиков: 3 дня (вы можете
        изменить его).
      </span>
      <div className={styles.buttonModal}>
        <Button
          className="button-transparent"
          onClick={e => {
            e.preventDefault();
            setIsOpenModalResTimes(true);
            setIsOpenModalReqInfoSuppliers(false);
          }}
        >
          Изменить время ответа
        </Button>
        <Button className="button-primary" onClick={() => {}}>
          Запросить
        </Button>
      </div>
    </div>
  );
}
