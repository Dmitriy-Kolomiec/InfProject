import styles from './selectGroup.module.css';
import PageContent from '@/app/components/PageContent/PageContent';
import { Button, Form, Select } from 'antd';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import {
  IAutoModel,
  IAutoTypes,
} from '@/interface/addingProduct/options.interface';
import { getPopupContainer } from '@/data/utils.common';

interface IProps {
  handleSubmit: (value: any) => void;
  isLoader: boolean;
}

export default function SelectGroup({ handleSubmit, isLoader }: IProps) {
  const [form] = Form.useForm();
  const [type, setType] = useState<number | null>(null);
  const [brand, setBrand] = useState<number | null>(null);
  const [autoTypes, setAutoTypes] = useState<IAutoTypes[]>();
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
        API_ENDPOINTS.GET_AUTO_MODEL(Number(typeId), Number(brandId)),
      );
      setAutoModels(response.data);
    } catch (error) {
      console.error('Ошибка при получении моделей автомобилей:', error);
    }
  };

  useEffect(() => {
    fetchAutoTypes();
    form.resetFields(['brand', 'autoModels']);
  }, [type, form]);

  useEffect(() => {
    if (type) {
      fetchAutoBrands();
      form.resetFields(['autoModels']);
    }
  }, [type, brand, form]);

  useEffect(() => {
    if (type && brand) {
      fetchAutoModel(type, brand);
    }
  }, [brand, type]);

  const handleTypeChange = (value: number) => {
    setType(value);
  };
  const handleBrandChange = (value: number) => {
    setBrand(value);
  };

  return (
    <PageContent>
      <Form
        className={styles.form}
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item name="type" label={<LabelTitle text="Тип" />} colon={false}>
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
          name="brand"
          label={<LabelTitle text="Бренд" />}
          colon={false}
        >
          <Select
            getPopupContainer={getPopupContainer}
            onChange={handleBrandChange}
            disabled={!type}
            placeholder="Выберите из списка"
            options={autoBrands?.map(brand => ({
              key: brand.id,
              value: brand.id,
              label: brand.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="model"
          label={<LabelTitle text="Модель" />}
          colon={false}
        >
          <Select
            getPopupContainer={getPopupContainer}
            disabled={!brand}
            placeholder="Выберите из списка"
            options={autoModels?.map(model => ({
              key: model.id,
              value: model.id,
              label: model.name,
            }))}
          />
        </Form.Item>
        <Button
          className={classNames(['button-white', styles.categoryTreeButton])}
          htmlType="submit"
          loading={isLoader}
        >
          Загрузить дерево категорий
        </Button>
      </Form>
    </PageContent>
  );
}
