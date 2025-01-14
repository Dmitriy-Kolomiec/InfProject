import SuccessIcon from '@/public/success.svg';
import styles from './editRequest.module.css';

export const SaveNotification = () => {
  return (
    <div className={styles.notification}>
      <div className={styles.icon}>
        <SuccessIcon />
      </div>
      <span>Заявка сохранена</span>
    </div>
  );
};
