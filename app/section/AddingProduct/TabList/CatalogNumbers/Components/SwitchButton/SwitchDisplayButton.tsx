import { Button } from 'antd';
import styles from './switchDisplayButton.module.css';
import classNames from 'classnames';

interface IProps {
  firstButtonName?: string;
  secondButtonName?: 'Дерево' | 'Список';
  active: string | null;
  isDisabled?: boolean;
  setDisplayLayout: (value: string) => void;
}

export default function SwitchDisplayButton({
  firstButtonName = 'Таблица',
  secondButtonName = 'Дерево',
  active,
  setDisplayLayout,
  isDisabled,
}: IProps) {
  console.log('active', active);
  return (
    <div className={styles.container}>
      <Button
        key={firstButtonName}
        className={classNames([
          styles.button,
          {
            [styles.active]: active === 'table' || active === null,
          },
        ])}
        onClick={() => setDisplayLayout('table')}
      >
        {firstButtonName}
      </Button>
      <Button
        key={secondButtonName}
        className={classNames([
          styles.button,
          {
            [styles.active]: active === 'tree' || active === 'list',
          },
        ])}
        onClick={() =>
          setDisplayLayout(secondButtonName === 'Дерево' ? 'tree' : 'list')
        }
        disabled={isDisabled}
      >
        {secondButtonName}
      </Button>
    </div>
  );
}
