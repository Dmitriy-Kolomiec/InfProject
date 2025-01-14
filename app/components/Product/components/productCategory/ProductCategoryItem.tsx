import { Button } from 'antd';
import styles from '../../product.module.css';
import classNames from 'classnames';

interface Props {
  onClick: () => void;
  title: string | number;
  isSelected: boolean | undefined;
  isDisabled: boolean | undefined;
}

export const ProductCategoryItem: React.FC<Props> = props => {
  const { title, isSelected, isDisabled, onClick } = props;

  return (
    <Button
      onClick={onClick}
      disabled={isDisabled}
      className={classNames([
        'button-white',
        styles.button,
        {
          [styles.activeButton]: isSelected,
        },
      ])}
    >
      {title}
    </Button>
  );
};
