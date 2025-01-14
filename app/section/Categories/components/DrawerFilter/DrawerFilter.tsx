import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Form, Select, FormInstance, Tag } from 'antd';
import PageContent from '@/app/components/PageContent/PageContent';
import CloseIcon from '@/public/close.svg';
import classNames from 'classnames';
import styles from './drawerFilter.module.css';
import { getPopupContainer, onFormFieldsChange } from '@/data/utils.common';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import {
  IAutoModel,
  IAutoTypes,
} from '@/interface/addingProduct/options.interface';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { ITags } from '@/interface/addingProduct/addPartNumber.interface';

const CHECKING_FIELDS_NAME = ['autoType'];

interface IProps {
  form: FormInstance<any>;
  handleSubmitFilter: (value: any) => void;
  tags: ITags[];
  setTags: Dispatch<SetStateAction<ITags[]>>;
  setIsDisabled: Dispatch<SetStateAction<boolean>>;
}

// TODO сделать один компонент в drawer add characteristic for partnumber
export default function DrawerFilter({
  form,
  handleSubmitFilter,
  tags,
  setTags,
  setIsDisabled,
}: IProps) {
  const [autoTypes, setAutoTypes] = useState<IAutoTypes[]>();
  const [typeId, setTypeId] = useState<number>();
  const [brandId, setBrandId] = useState<number>();
  const [autoBrands, setAutoBrands] = useState<IAutoTypes[]>();
  const [autoModels, setAutoModels] = useState<IAutoModel[]>();

  const fetchAutoTypes = async () => {
    try {
      const response = await APIRequest.get(API_ENDPOINTS.GET_AUTO_TYPES);
      setAutoTypes(response.data);
    } catch (error) {
      console.error('Ошибка при получении типов автомобилей:', error);
    }
  };

  const fetchAutoBrands = async () => {
    try {
      const response = await APIRequest.get(API_ENDPOINTS.GET_AUTO_BRANDS);
      setAutoBrands(response.data);
    } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
    }
  };
  const fetchAutoModel = async (typeId: number, brandId: number) => {
    try {
      const response = await APIRequest.get(
        API_ENDPOINTS.GET_AUTO_MODEL(typeId, brandId),
      );
      setAutoModels(response.data);
    } catch (error) {
      console.error('Ошибка при получении моделей автомобилей:', error);
    }
  };

  const handleTypeChange = (value: number) => {
    setTypeId(value);
    handleClearTags();
  };
  const handleBrandChange = (value: number) => {
    setBrandId(value);
    handleClearTags();
  };
  const handleClearTags = () => {
    setTags([]);
    form.resetFields(['autoModelsIds']);
  };

  const onChangeModels = (_: string, option: any) => {
    if (option) {
      const newTags = option.map((o: any) => ({
        id: o.value,
        name: o.label,
      }));
      setTags(newTags);
    }
  };
  const handleTagClose = (tagToRemove: ITags) => {
    const updatedTags = tags.filter(tag => tag.id !== tagToRemove.id);
    setTags(updatedTags);
    if (tags.length <= 0) {
      form.resetFields(['autoModels']);
    }
  };

  useEffect(() => {
    fetchAutoTypes();
    form.resetFields(['autoBrand', 'autoModels']);
  }, [typeId, form]);

  useEffect(() => {
    if (typeId) {
      fetchAutoBrands();
      form.resetFields(['autoModels']);
    }
  }, [typeId, brandId, form]);

  useEffect(() => {
    if (typeId && brandId) {
      fetchAutoModel(typeId, brandId);
    }
  }, [brandId, typeId]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmitFilter}
      requiredMark={false}
      className={styles.form}
      onFieldsChange={changedFields =>
        onFormFieldsChange(
          form,
          setIsDisabled,
          CHECKING_FIELDS_NAME,
          changedFields,
        )
      }
    >
      <PageContent>
        <Form.Item
          name="autoType"
          label={<LabelTitle text="Тип транспорта" />}
          colon={false}
        >
          <Select
            getPopupContainer={getPopupContainer}
            onChange={handleTypeChange}
            placeholder="Выберите из списка"
            options={autoTypes?.map(type => ({
              key: type.id,
              value: type.id,
              label: type.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="autoBrand"
          label={<LabelTitle text="Бренд" />}
          colon={false}
        >
          <Select
            getPopupContainer={getPopupContainer}
            onChange={handleBrandChange}
            placeholder="Выберите из списка"
            options={autoBrands?.map(brand => ({
              key: brand.id,
              value: brand.id,
              label: brand.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="autoModel"
          label={<LabelTitle text="Модель" />}
          colon={false}
        >
          <div>
            <Select
              getPopupContainer={getPopupContainer}
              placeholder="Выберите из списка"
              mode="multiple"
              onChange={onChangeModels}
              options={autoModels?.map(model => ({
                key: model.id,
                value: model.id,
                label: model.name,
              }))}
              className="select-tags"
            />
            {tags.length >= 1 && (
              <Tag className={classNames([styles.clearTagsSelect, styles.tag])}>
                <span className={styles.countTags}>{tags.length}</span>
                <Button
                  className={classNames([
                    styles.clearTagsButton,
                    'button-transparent',
                  ])}
                  onClick={handleClearTags}
                >
                  <CloseIcon />
                </Button>
              </Tag>
            )}
          </div>
        </Form.Item>
        {tags.length >= 1 && (
          <div className={styles.tags}>
            {tags?.map((tag: ITags, index: number) => (
              <Tag
                onClose={() => handleTagClose(tag)}
                key={index}
                closable
                className={styles.tag}
              >
                {tag.name}
              </Tag>
            ))}
            {tags.length >= 2 && (
              <Tag
                className={classNames([styles.tag, styles.clearAll])}
                onClick={handleClearTags}
              >
                Очистить всё
              </Tag>
            )}
          </div>
        )}
      </PageContent>
    </Form>
  );
}
