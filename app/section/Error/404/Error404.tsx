import React from 'react';
import { Title } from '@/app/components/Title/Title';
import Page from '@/app/components/Page/Page';
import styles from './404.module.css';

export default function Error404Page() {
  return (
    <Page className={styles.error}>
      <Title tag="h1">Ничего не найдено</Title>
    </Page>
  );
}
