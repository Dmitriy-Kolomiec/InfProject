import { useState } from 'react';
import HideIcon from '@/public/hideIcon.svg';

import styles from './table.module.css';
import { Button } from 'antd';

export const PasswordCell = ({
  password,
  shouldShow,
}: {
  password: string;
  shouldShow: boolean;
}) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const isShowPassword = shouldShow || isShow;
  return (
    <div className={styles.password}>
      <span>{isShowPassword ? password : '**********'}</span>
      <Button onClick={() => setIsShow(!isShow)} className="button-transparent">
        <HideIcon />
      </Button>
    </div>
  );
};
