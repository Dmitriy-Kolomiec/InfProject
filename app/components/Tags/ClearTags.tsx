import { Button, Tag } from 'antd';
import classNames from 'classnames';
import styles from './tags.module.css';
import CloseIcon from '@/public/close.svg';

interface IProps {
  countTags: number;
  onClick: () => void;
}

export const ClearTags = ({ countTags, onClick }: IProps) => {
  return (
    <Tag className={classNames([styles.clearTagsSelect, styles.tag])}>
      <span className={styles.countTags}>{countTags}</span>
      <Button
        className={classNames([styles.clearTagsButton, 'button-transparent'])}
        onClick={onClick}
      >
        <CloseIcon />
      </Button>
    </Tag>
  );
};
