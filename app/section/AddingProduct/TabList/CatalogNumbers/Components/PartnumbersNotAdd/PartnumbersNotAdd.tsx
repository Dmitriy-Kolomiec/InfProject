import styles from './partnumbersNotAdd.module.css';
import { Button } from 'antd';
import { Title } from '@/app/components/Title/Title';
import PlusIcon from '@/public/plus.svg';

interface IProps {
  showDrawer: () => void;
}

export default function PartnumbersNotAdd({ showDrawer }: IProps) {
  return (
    <div className={styles.container}>
      <div>
        <Title tag="h3">Каталожные номера не добавлены</Title>

        <div>
          <div className={styles.text}>
            Здесь будут добавленные вами каталожные номера
          </div>
          <div className={styles.addPartnumbersButton}>
            <Button className="button-white" onClick={showDrawer}>
              <PlusIcon />
              Добавить каталожный номер
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
