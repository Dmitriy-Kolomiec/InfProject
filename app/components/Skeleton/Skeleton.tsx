import { Space, Skeleton } from 'antd';
import styles from './skeleton.module.css';

interface IProps {
  size?: 'small' | 'large';
  renderCount?: number;
}

export const Skelet = ({ size = 'small', renderCount = 5 }: IProps) => {
  return (
    <Space className={styles.skeletons}>
      {Array.from({ length: renderCount }, (_, i) => (
        <Skeleton.Button
          key={i}
          active
          className={styles.skeleton}
          size={size}
        />
      ))}
    </Space>
  );
};
