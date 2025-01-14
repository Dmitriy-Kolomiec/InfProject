import { SelectProps, Tag } from 'antd';
import classNames from 'classnames';
import styles from './tablePartnumbers.module.css';

type TagRender = SelectProps['tagRender'];
export const tagRender: TagRender = props => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      className={classNames(['multipleTags', styles.tagValue])}
    >
      {label}
    </Tag>
  );
};
