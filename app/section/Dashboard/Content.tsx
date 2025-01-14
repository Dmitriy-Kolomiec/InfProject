'use client';
import { API_ENDPOINTS } from '@/data/api/api.data';
import APIRequest from '@/data/api/api.utils';
import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import { StatisticCategories } from './components/statisticCategories';
import { StatisticProduct } from './components/statisticProducts';
import { StatisticUsers } from './components/statisticUsers';
import { Title } from '@/app/components/Title/Title';

export default function DashboardPageContent() {
  const [statistic, setStatistic] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await APIRequest.get(API_ENDPOINTS.GET_DASHBOARD);
      setStatistic(data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Title tag="h2">Панель управления</Title>
      <div className={styles.container}>
        <StatisticCategories {...statistic} />
        <StatisticProduct {...statistic} />
        <StatisticUsers {...statistic} />
      </div>
    </>
  );
}
