import { useRef, useState } from 'react';
import { Cascader, CascaderProps } from 'antd';
import styles from './sidebarMenu.module.css';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { APP_PATHS } from '@/data/paths.data';

interface ICategoriesTree {
  value: string;
  label: string;
  parentId: number;
  id: number;
  count: string;
  children?: ICategoriesTree[];
}

interface IProps {
  categoriesTree: ICategoriesTree[] | null;
}

export const SidebarMenu = ({ categoriesTree }: IProps) => {
  const [key, setKey] = useState(0); //
  const timeoutRef = useRef<number | null>(null);
  const router = useRouter();

  const onChange: CascaderProps<ICategoriesTree>['onChange'] = (value: any) => {
    router.push(APP_PATHS.PUBLIC_CATALOG(value.at(-1)));
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setKey(prevKey => prevKey + 1);
    }, 200);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <div className={classNames([styles.container, 'sidebar-menu'])}>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {!!categoriesTree && (
          <Cascader.Panel
            key={key}
            options={categoriesTree}
            onChange={onChange}
            className={styles.cascader}
            expandTrigger="hover"
            changeOnSelect
          />
        )}
      </div>
    </div>
  );
};
