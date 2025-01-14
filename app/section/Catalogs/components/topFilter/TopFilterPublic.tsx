'use client';
import { Button, Modal, Radio } from 'antd';
import styles from './topFilter.module.css';
import { useEffect } from 'react';
import FilterTopModal from '@/app/components/Modal/Request/filter-top/FilterTopModal';
import classNames from 'classnames';
import ListIcon from '@/public/listIcon.svg';
import DiasplayTableIcon from '@/public/display-table.svg';
import { useTopFilterPublic } from './useTopFilterPublic.hook';

interface IProps {
  labelCategory: string;
}
export const TopFilterPublic = ({ labelCategory }: IProps) => {
  const {
    tagsModel,
    tagsManufacturers,
    form,
    countFilter,
    setCountFilter,
    isOpenModalFilter,
    setIsOpenModalFilter,
    displayLayout,
    autoTypeQuery,
    autoBrandQuery,
    autoModelQuery,
    isOnlyInStockQuery,
    clearFilterQuery,
    onChangeRadio,
    onDisplayTable,
    onDisplayList,
    calculateActiveFilters,
    setTagsModel,
    setTagsManufacturers,
  } = useTopFilterPublic({ labelCategory });

  useEffect(() => {
    calculateActiveFilters();
  }, [autoTypeQuery, autoBrandQuery, autoModelQuery]);

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.switchBlock}>
          <Button
            className={classNames([styles.button], {
              [styles.activeButton]:
                displayLayout === 'table' || displayLayout === null,
            })}
            onClick={onDisplayTable}
          >
            <ListIcon />
          </Button>
          <Button
            className={classNames([styles.button], {
              [styles.activeButton]: displayLayout === 'card',
            })}
            onClick={onDisplayList}
          >
            <DiasplayTableIcon />
          </Button>
        </div>
        <Radio.Group
          onChange={onChangeRadio}
          className={styles.radioGroup}
          defaultValue={isOnlyInStockQuery || 'false'}
        >
          <Radio value="false" name="all">
            Все
          </Radio>
          <Radio value="true" name="inStock">
            Только в наличии
          </Radio>
        </Radio.Group>
      </div>
      <div className={styles.filterButton}>
        {!!countFilter && (
          <Button
            className="button-transparent"
            onClick={() => clearFilterQuery(labelCategory!)}
          >
            Сбросить
          </Button>
        )}
        <Button
          className={styles.buttonFilter}
          onClick={() => setIsOpenModalFilter(true)}
        >
          Фильтр
          {!!countFilter && (
            <span className={styles.countFilter}>{countFilter}</span>
          )}
        </Button>
      </div>
      <Modal
        open={isOpenModalFilter}
        onCancel={() => setIsOpenModalFilter(false)}
        centered
        className={styles.modalDelete}
        title={null}
        footer={null}
        width={480}
        zIndex={3000}
      >
        <FilterTopModal
          tagsModel={tagsModel}
          setTagsModel={setTagsModel}
          tagsManufacturers={tagsManufacturers}
          setTagsManufacturers={setTagsManufacturers}
          form={form}
          setCountFilter={setCountFilter}
          hideModal={setIsOpenModalFilter}
        />
      </Modal>
    </div>
  );
};
