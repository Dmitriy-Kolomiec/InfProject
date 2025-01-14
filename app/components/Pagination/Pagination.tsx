import { getPopupContainer } from '@/data/utils.common';
import styles from './pagination.module.css';
import { Pagination, Select } from 'antd';

interface IProps<T> {
  data: T[];
  page: number;
  pageSize: number;
  onChange: (value: number) => void;
  onChangeSelect: (value: string) => void;
}

export const CustomPagination = <T,>({
  data,
  page,
  pageSize,
  onChange,
  onChangeSelect,
}: IProps<T>) => {
  return (
    <div className={styles.pagination}>
      <div></div>
      <Pagination
        defaultCurrent={page}
        total={data.length}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
      />
      {data && data.length > 10 && (
        <div className={styles.select}>
          <span className={styles.labelSelect}>Отображать по</span>
          <Select
            getPopupContainer={getPopupContainer}
            defaultValue="10"
            onChange={onChangeSelect}
            popupMatchSelectWidth={60}
            options={[
              {
                value: '10',
                label: '10',
              },
              {
                value: '20',
                label: '20',
              },
              {
                value: '50',
                label: '50',
              },
              {
                value: '100',
                label: '100',
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};
