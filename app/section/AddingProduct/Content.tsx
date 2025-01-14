'use client';
import React from 'react';
import { AddProductProps } from './addProduct.props';
import styles from './addProduct.module.css';
import { Title } from '@/app/components/Title/Title';
import { ITabList } from '@/app/components/TabList/tabList.props';
import TabList from '@/app/components/TabList/TabList';
import PageContent from '@/app/components/PageContent/PageContent';
import AddProductPageContentTabs from './TabList/Tabs';
import { Breadcrumb } from 'antd';
import { APP_PATHS } from '@/data/paths.data';
import Link from 'next/link';

const TAB_LIST: ITabList[] = [
  { title: 'Описание', nameQuery: 'description' },
  { title: 'Параметры', nameQuery: 'options' },
  { title: 'Каталожные номера', nameQuery: 'partnumbers' },
  { title: 'Связи', nameQuery: 'relations' },
];

export default function AddProductPageContent({
  className,
  ...props
}: AddProductProps): React.ReactElement {
  return (
    <div className={styles.container} {...props}>
      <div>
        <Breadcrumb
          className="bread-crumb"
          items={[
            {
              title: (
                <Link className="bread-crumb_link" href={APP_PATHS.CATEGORIES}>
                  Категории
                </Link>
              ),
            },
            {
              title: (
                <span className="bread-crumb_item">Добавление товара</span>
              ),
            },
          ]}
        />
        <Title tag="h2">Добавление товара</Title>

        <PageContent className={styles.tabContainer}>
          <TabList activeTab="description" tabList={TAB_LIST} readonly />
        </PageContent>

        <AddProductPageContentTabs activeTab="description" />
      </div>
    </div>
  );
}
