import classNames from 'classnames';
import styles from './Page.module.css';
import { PageProps } from './Page.props';
import React from 'react';

export default function Page({
  widthLarge = false,
  className,
  children,
  ...props
}: PageProps): React.ReactElement {
  return (
    <div
      className={classNames([styles.pageContainer, className], {
        [styles.large]: widthLarge,
      })}
      {...props}
    >
      {children}
    </div>
  );
}
