'use client';
import { Breadcrumb, Table, TableProps } from 'antd';
import { SearchProduct } from '../Catalogs/components/searchProduct/SearchProduct';
import { Title } from '@/app/components/Title/Title';
import Link from 'next/link';
import { APP_PATHS } from '@/data/paths.data';
import classNames from 'classnames';
import styles from './search.module.css';
import { formatPrice, getPlurals } from '@/data/utils.common';
import { ISearchResults } from '@/interface/search/search.interface';
import PageContent from '@/app/components/PageContent/PageContent';

type ColumnsType<T> = TableProps<T>['columns'];

interface ITableData {
  key: string;
  name: string;
  partNumber: string;
  manufacturer: string;
  price: number;
  vat: number;
}

interface IProps {
  serchProductsList: ISearchResults | null;
  searchString: string;
}

export const SearchPageContent = ({
  serchProductsList,
  searchString,
}: IProps) => {
  const products = serchProductsList?.searchingResults;
  const productsLength = serchProductsList?.searchingResults.length;

  const tableData: ITableData[] = [];
  products?.forEach((p, index) => {
    tableData.push({
      key: `${p.product.id}__${index}`,
      name: p.product.name,
      partNumber: p.partNumber.name,
      manufacturer: p.manufacturer.name,
      price: p.stockBalance.price,
      vat: p.stockBalance.vat,
    });
  });
  const columns: ColumnsType<ITableData> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      width: '42%',
      className: styles.cellName,
      render: (value, row) => {
        if (value) {
          return (
            <Link
              href={APP_PATHS.PUBLIC_PRODUCT(Number(row.key.split('__')[0]))}
              className={styles.link}
            >
              {value}
            </Link>
          );
        }
        return null;
      },
    },
    {
      title: 'Каталожный номер',
      dataIndex: 'partNumber',
      key: 'partNumber',
      width: '26%',
    },
    {
      title: 'Производитель',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: '16%',
    },
    {
      title: 'Цена, шт',
      dataIndex: 'price',
      key: 'price',
      //   defaultSortOrder: 'descend',
      //   sorter: (a, b) => a.price - b.price,
      width: '16%',
      render: (price, record) => (
        <div className={styles.price}>
          <div className={styles.summ}>{formatPrice(price)} &#8381;</div>
          <div className={styles.neutralText}>
            {!!record.vat ? 'с НДС' : 'без НДС'}
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <SearchProduct initialValue={searchString} />
      <Breadcrumb
        className={classNames(['bread-crumb', styles.breadcrumb])}
        items={[
          {
            title: (
              <Link className="bread-crumb_link" href={APP_PATHS.HOME}>
                Поиск
              </Link>
            ),
          },
          {
            title: <span className="bread-crumb_item">{searchString}</span>,
          },
        ]}
      />
      <Title tag="h2">Результаты поиска</Title>

      <PageContent>
        {productsLength ? (
          <>
            <Table
              pagination={false}
              className={styles.table}
              size="small"
              showSorterTooltip={false}
              rowKey={record => record.key}
              columns={columns}
              dataSource={tableData}
              bordered
            />
            <div className={styles.totalProducts}>
              {productsLength > 1 ? 'Найдено' : 'Найден '} {productsLength}{' '}
              {getPlurals(productsLength, 'товар', 'товара', 'товаров')}
            </div>
          </>
        ) : (
          <div className={styles.notData}>
            Товары по данному запросу не найдены
          </div>
        )}
      </PageContent>
    </>
  );
};
