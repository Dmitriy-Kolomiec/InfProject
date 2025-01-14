import { TitleProps } from './Title.props';
import styles from './Title.module.css';
import classNames from 'classnames';
import React from 'react';

export const Title = ({
  children,
  tag,
  className,
}: TitleProps): React.ReactElement => {
  switch (tag) {
    case 'h1':
      return <h1 className={classNames([styles.h1, className])}>{children}</h1>;
    case 'h2':
      return <h2 className={classNames([styles.h2, className])}>{children}</h2>;
    case 'h3':
      return <h3 className={classNames([styles.h3, className])}>{children}</h3>;
    default:
      return <></>;
  }
};
