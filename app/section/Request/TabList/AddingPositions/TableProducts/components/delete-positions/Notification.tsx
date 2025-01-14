import NotiseIcon from '@/public/notise.svg';
import styles from './deletePositions.module.css';
export const NotificationDeleteRows = () => {
  return (
    <div className={styles.notification}>
      <div className={styles.icon}>
        <NotiseIcon />
      </div>
      <span>Выбранные позиции удалены</span>
    </div>
  );
};
