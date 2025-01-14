import classNames from 'classnames';
import styles from './PageContent.module.css';
import { PageContentProps } from './PageContent.props';
import React from 'react';

export default function PageContent({
  isCenter,
  className,
  children,
  ...props
}: PageContentProps): React.ReactElement {
  return (
    <div
      className={classNames([
        styles.pageContent,
        className,
        {
          [styles.center]: isCenter,
        },
      ])}
      {...props}
    >
      {children}
    </div>
  );
}
