import React from 'react';
import { ITabList, TabListProps } from './tabList.props';
import Link from 'next/link';
import classNames from 'classnames';
import styles from './tabList.module.css';

export default function TabList({
  activeTab,
  tabList,
  productID,
  readonly = false,
  className,
  ...props
}: TabListProps): React.ReactElement {
  return (
    <div className={classNames([styles.tabList, className])} {...props}>
      {tabList.map((tab: ITabList, index: any) => (
        <div key={index}>
          {readonly ? (
            <div
              className={classNames(styles.tabLink, {
                [styles.active]: activeTab === tab.nameQuery,
                [styles.disabled]: readonly,
              })}
            >
              {tab.title}
            </div>
          ) : (
            <>
              {productID ? (
                <Link
                  href={{ query: { tab: tab.nameQuery, productId: productID } }}
                  className={classNames(styles.tabLink, {
                    [styles.active]: activeTab === tab.nameQuery,
                  })}
                >
                  {tab.title}
                </Link>
              ) : (
                <Link
                  href={{ query: { tab: tab.nameQuery } }}
                  className={classNames(styles.tabLink, {
                    [styles.active]: activeTab === tab.nameQuery,
                  })}
                >
                  {tab.title}
                </Link>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
