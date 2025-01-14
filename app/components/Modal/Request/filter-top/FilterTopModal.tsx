import { Button, Divider, Form, Input, Radio, Select } from 'antd';
import styles from './filterTopModal.module.css';
import classNames from 'classnames';
import { Title } from '../../../Title/Title';
import { useEffect } from 'react';
import { FilterTopModalProps } from './FilterTopModal.props';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { ClearTags } from '@/app/components/Tags/ClearTags';
import { Tags } from '@/app/components/Tags/Tags';
import { getPopupContainer } from '@/data/utils.common';
import { useFilterTop } from './useFilterTop.hook';

export default function FilterTopModal({
  form,
  setCountFilter,
  hideModal,
  tagsModel,
  setTagsModel,
  tagsManufacturers,
  setTagsManufacturers,
  isOrderFormation = false,
}: FilterTopModalProps) {
  const {
    autoTypes,
    autoBrands,
    autoModels,
    manufacturers,
    labelType,
    labelBrand,
    initializeForm,
    onFinish,
    handleTypeChange,
    handleBrandChange,
    handleModelChange,
    handleManufactureChange,
    handleClearTagsModel,
    handleClearTagsManufacture,
    handleTagCloseModel,
    handleTagCloseManufacture,
    fetchAutoTypes,
    fetchAutoBrands,
    fetchAutoModel,
    fetchManufacturers,
  } = useFilterTop({
    form,
    setCountFilter,
    hideModal,
    tagsModel,
    setTagsModel,
    tagsManufacturers,
    setTagsManufacturers,
    isOrderFormation,
  });

  useEffect(() => {
    initializeForm();
    fetchManufacturers();
    // TODO
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAutoTypes();
    form.resetFields(['brand', 'model']);
  }, [labelType, form]);

  useEffect(() => {
    if (labelType) {
      fetchAutoBrands(labelType);
      form.resetFields(['model']);
    }
  }, [labelType, labelBrand, form]);

  useEffect(() => {
    if (labelType && labelBrand) {
      fetchAutoModel(labelType, labelBrand);
    }
  }, [labelBrand, labelType]);

  return (
    <>
      <Title tag="h3">Фильтры</Title>
      <Divider />
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
              name="type"
              label={<LabelTitle text="Тип транспорта" />}
              colon={false}
              className={styles.selectBlock}
            >
              <Select
                getPopupContainer={getPopupContainer}
                onChange={handleTypeChange}
                placeholder="Выберите из списка"
                options={autoTypes?.map(type => ({
                  key: type.label,
                  value: type.label,
                  label: type.name,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="brand"
              label={<LabelTitle text="Марка автомобиля" />}
              colon={false}
              className={styles.selectBlock}
            >
              <Select
                disabled={!labelType}
                getPopupContainer={getPopupContainer}
                onChange={handleBrandChange}
                placeholder="Выберите из списка"
                options={autoBrands?.map(brand => ({
                  key: brand.id,
                  value: brand.label,
                  label: brand.name,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="model"
              label={<LabelTitle text="Модель" />}
              colon={false}
              className={styles.selectBlock}
            >
              <div>
                <Select
                  disabled={!labelBrand}
                  getPopupContainer={getPopupContainer}
                  onChange={handleModelChange}
                  mode="multiple"
                  className="select-tags"
                  placeholder="Выберите из списка"
                  options={autoModels?.map(model => ({
                    key: model.id,
                    value: model.label,
                    label: model.name,
                  }))}
                />
                {tagsModel.length >= 1 && (
                  <ClearTags
                    countTags={tagsModel.length}
                    onClick={handleClearTagsModel}
                  />
                )}
              </div>
            </Form.Item>
            {tagsModel.length >= 1 && (
              <Tags
                tags={tagsModel}
                onTagClose={handleTagCloseModel}
                onClearTags={handleClearTagsModel}
              />
            )}
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
                  options={manufacturers?.map(item => ({
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
