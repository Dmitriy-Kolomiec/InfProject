import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/app/components/Header/Header';
import Footer from './components/Footer/Footer';
import classNames from 'classnames';
import { ConfigProvider } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import React from 'react';
import '../styles/main.css';
import { Providers } from './Providers';
import locale from 'antd/locale/ru_RU';
import dayjs from 'dayjs';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'INF-MARKET',
    description: 'Inf.market - Купить запчасти просто и быстро',
    keywords: 'инф маркет, инфмаркет, инф.маркет, инф, infmarket, inf',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  dayjs.locale('ru_RU');
  return (
    <Providers>
      <html lang="ru">
        <ConfigProvider
          locale={locale}
          wave={{ disabled: true }}
          theme={{
            // hashed: false,
            components: {
              Select: {
                multipleItemHeight: 54,
              },
            },
            token: {
              colorPrimary: '#fa3c30',
              colorLink: '#fa3c30',
              colorInfo: '#fa3c30',
              colorText: '#182f35',
              colorBorder: '#b3b3b3',
              fontSize: 15,
              controlHeight: 40,
            },
          }}
        >
          <body className={classNames([inter.className, 'layout'])}>
            <AntdRegistry>
              <Header />
              {children}
              <Footer />
            </AntdRegistry>
          </body>
        </ConfigProvider>
      </html>
    </Providers>
  );
}
