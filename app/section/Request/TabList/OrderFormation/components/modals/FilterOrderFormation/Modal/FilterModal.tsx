import { Button, Divider, Form, Input, Radio, Select } from 'antd';
import classNames from 'classnames';
import { useEffect } from 'react';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { ClearTags } from '@/app/components/Tags/ClearTags';
import { Tags } from '@/app/components/Tags/Tags';
import { getPopupContainer } from '@/data/utils.common';
import { FilterModalProps } from './FilterModal.props';
import { useFilterModal } from './useFilterModal.hook';
import { Title } from '../../../../../../../../components/Title/Title';
import styles from './filterModal.module.css';

export default function FilterModal({
  form,
  setCountFilter,
  hideModal,
  tagsSellers,
  setTagsSellers,
  tagsManufacturers,
  setTagsManufacturers,
}: FilterModalProps) {
  const {
    dataFilter,
    initializeForm,
    onFinish,
    handleManufactureChange,
    handleClearTagsManufacture,
    handleTagCloseManufacture,
    handleTagCloseSellers,
    handleClearTagsSellers,
    handleSellersChange,
  } = useFilterModal({
    form,
    setCountFilter,
    hideModal,
    tagsSellers,
    setTagsSellers,
    tagsManufacturers,
    setTagsManufacturers,
  });

  useEffect(() => {
    if (dataFilter) {
      initializeForm();
    }
  }, [dataFilter]);

  return (
    <>
      <Title tag="h3">Фильтры</Title>
      <Divider className={styles.divider} />
      <Form
        className={styles.form}
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <div>
          <Form.Item name="isOnlyStock" initialValue={'all'}>
            <Radio.Group className={styles.radioGroup}>
              <Radio value="false" name="all">
                Все
              </Radio>
              <Radio value="true" name="inStock">
                Только в наличии
              </Radio>
            </Radio.Group>
          </Form.Item>

          <div className={styles.selectBlock}>
            <Form.Item
              name="manufacturer"
              label={<LabelTitle text="Производитель" />}
              colon={false}
              className={styles.selectBlock}
            >
              <div>
                <Select
                  getPopupContainer={getPopupContainer}
                  mode="multiple"
                  onChange={handleManufactureChange}
                  className="select-tags"
                  placeholder="Выберите из списка"
                  options={dataFilter?.manufacturers?.map(item => ({
                    key: item.id,
                    value: item.label,
                    label: item.name,
                  }))}
                />
                {tagsManufacturers.length >= 1 && (
                  <ClearTags
                    countTags={tagsManufacturers.length}
                    onClick={handleClearTagsManufacture}
                  />
                )}
              </div>
            </Form.Item>
            {tagsManufacturers.length >= 1 && (
              <Tags
                tags={tagsManufacturers}
                onTagClose={handleTagCloseManufacture}
                onClearTags={handleClearTagsManufacture}
              />
            )}
            <div className={styles.group}>
              <Form.Item
                name="priceStart"
                label={<LabelTitle text="Цена, ₽" />}
              >
                <Input className={styles.input} placeholder="От" />
              </Form.Item>
              <Form.Item name="priceEnd">
                <Input className={styles.priceEnd} placeholder="До" />
              </Form.Item>
            </div>
            <Form.Item
              name="sellers"
              label={<LabelTitle text="Поставщик" />}
              colon={false}
              className={styles.selectBlock}
            >
              <div>
                <Select
                  getPopupContainer={getPopupContainer}
                  mode="multiple"
                  onChange={handleSellersChange}
                  className="select-tags"
                  placeholder="Выберите из списка"
                  options={dataFilter?.sellers?.map(item => ({
                    key: item.id,
                    value: item.id,
                    label: item.name,
                  }))}
                />
                {tagsSellers.length >= 1 && (
                  <ClearTags
                    countTags={tagsSellers.length}
                    onClick={handleClearTagsSellers}
                  />
                )}
              </div>
            </Form.Item>
            {tagsSellers.length >= 1 && (
              <Tags
                tags={tagsSellers}
                onTagClose={handleTagCloseSellers}
                onClearTags={handleClearTagsSellers}
              />
            )}
          </div>
        </div>
        <Button
          htmlType="submit"
          className={classNames(['button-primary', styles.button])}
        >
          Применить
        </Button>
      </Form>
    </>
  );
}
