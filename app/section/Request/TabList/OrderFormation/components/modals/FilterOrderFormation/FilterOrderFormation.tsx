import { Button, Form, Modal, Select } from 'antd';
import styles from './filterOrderFormation.module.css';
import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { IFilterOrderFormationProps } from './FilterOrderFormation.props';
import { getPopupContainer } from '@/data/utils.common';
import { ITags } from '@/interface/addingProduct/addPartNumber.interface';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterModal from './Modal/FilterModal';
import { APP_PATHS } from '@/data/paths.data';
import { RequestContext } from '@/context/Request/request.context';

export default function FilterTop({
  className,
  ...props
}: IFilterOrderFormationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dataRequest } = useContext(RequestContext);
  const [isOpenModalFilter, setIsOpenModalFilter] = useState<boolean>(false);
  const sellers = searchParams.get('sellers') || undefined;
  const isOnlyInStock = searchParams.get('isOnlyInStock') || false;
  const manufacturers: string | null = searchParams.get('manufacturers');
  const priceQuery: string | null = searchParams.get('price');
  const handleChange = (value: { value: string; label: React.ReactNode }) => {
    console.log(value);
  };
  const [tagsManufacturers, setTagsManufacturers] = useState<ITags[]>([]);
  const [tagsSellers, setTagsSellers] = useState<ITags[]>([]);
  const [form] = Form.useForm();
  const [countFilter, setCountFilter] = useState<number>(0);

  const calculateActiveFilters = () => {
    const activeFilters = [
      sellers,
      manufacturers,
      priceQuery,
      isOnlyInStock !== 'false' && isOnlyInStock,
    ].filter(Boolean).length;

    setCountFilter(activeFilters);
  };

  useEffect(() => {
    calculateActiveFilters();
  }, [sellers, manufacturers, priceQuery]);

  const clearFilterQuery = () => {
    if (dataRequest.request?.id) {
      const params = new URLSearchParams();
      params.set('tab', 'formation');
      router.push(
        `${APP_PATHS.REQUESTS_VIEW(
          dataRequest.request.id,
        )}?${params.toString()}`,
      );
    }
    setCountFilter(0);
    form.resetFields();
    setTagsSellers([]);
    setTagsManufacturers([]);
  };

  return (
    <div className={classNames([styles.filter, className])} {...props}>
      <Select
        getPopupContainer={getPopupContainer}
        className={styles.select}
        labelInValue
        defaultValue={{ value: 'all', label: 'Все' }}
        onChange={handleChange}
        popupMatchSelectWidth={180}
        options={[
          {
            value: 'all',
            label: 'Все',
          },
          {
            value: 'requiring-request',
            label: 'Требующие запроса',
          },
        ]}
      />
      <Button
        className={classNames(['button-white', styles.button])}
        onClick={e => {
          e.preventDefault(), setIsOpenModalFilter(true);
        }}
      >
        Фильтр
        {!!countFilter && (
          <span className={styles.countFilter}>{countFilter}</span>
        )}
      </Button>
      {!!countFilter && (
        <Button className="button-transparent" onClick={clearFilterQuery}>
          Сбросить
        </Button>
      )}
      <Modal
        open={isOpenModalFilter}
        onCancel={() => setIsOpenModalFilter(false)}
        centered
        className={styles.modalDelete}
        title={null}
        footer={null}
        width={480}
      >
        <FilterModal
          tagsManufacturers={tagsManufacturers}
          setTagsManufacturers={setTagsManufacturers}
          tagsSellers={tagsSellers}
          setTagsSellers={setTagsSellers}
          form={form}
          setCountFilter={setCountFilter}
          hideModal={setIsOpenModalFilter}
        />
      </Modal>
    </div>
  );
}
