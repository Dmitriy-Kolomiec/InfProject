import { ITags } from '@/interface/addingProduct/addPartNumber.interface';
import styles from './tags.module.css';
import { Tag } from 'antd';
import classNames from 'classnames';

interface IProps {
  tags: ITags[];
  onTagClose: (tagToRemove: ITags) => void;
  onClearTags: () => void;
}

export const Tags = ({ tags, onTagClose, onClearTags }: IProps) => {
  return (
    <div className={styles.tags}>
      {tags.map((tag: ITags, index: number) => (
        <Tag
          onClose={() => onTagClose(tag)}
          key={index}
          closable
          className={styles.tag}
        >
          {tag.name}
        </Tag>
      ))}
      {tags.length >= 2 && (
        <Tag
          className={classNames([styles.tag, styles.clearAll])}
          onClick={onClearTags}
        >
          Очистить всё
        </Tag>
      )}
    </div>
  );
};
