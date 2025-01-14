import { Button, Checkbox, Form, FormInstance, Input, Tag } from 'antd';
import styles from './drawerRequest.module.css';
import classNames from 'classnames';
import styleTag from '../../supplyRequests.module.css';
import PageContent from '@/app/components/PageContent/PageContent';
import { onFormFieldsChange } from '@/data/utils.common';
import { Dispatch, SetStateAction, useState } from 'react';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { Title } from '@/app/components/Title/Title';

const CHECKING_FIELDS_NAME = ['name'];

interface IProps {
  formProduct: FormInstance<any>;
  formSupplier: FormInstance<any>;
  setIsDisabled: Dispatch<SetStateAction<any>>;
  onFinish: (value: any) => void;
}

export const DrawerRequest = ({
  formProduct,
  formSupplier,
  setIsDisabled,
  onFinish,
}: IProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.statusReq}>
        <div className={styles.status}>
          <span>Статус запроса</span>
          <span>
            <Tag
              className={classNames([styleTag.tag], {
                [styleTag.tagInProgress]: true,
              })}
              color={'blue'}
            >
              {'В работе'.toUpperCase()}
            </Tag>
          </span>
        </div>
        <div className={styles.status}>
          <span>Количество в запросе, шт</span>
          <span>100</span>
        </div>
      </div>
      <PageContent>
        <Form
          className={styles.form}
          form={formProduct}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          onFieldsChange={changedFields =>
            onFormFieldsChange(
              formProduct,
              setIsDisabled,
              CHECKING_FIELDS_NAME,
              changedFields,
            )
          }
        >
          <Title className={styles.title} tag="h3">
            Информация о товаре
          </Title>
          <Form.Item
            label={<LabelTitle text="Каталожный номер" />}
            name="partNumber"
          >
            <Input />
          </Form.Item>
          <Form.Item label={<LabelTitle text="Цена за шт, ₽" />} name="price">
            <Input />
          </Form.Item>
          <Form.Item name="vatIncluded" valuePropName="checked" label={null}>
            <Checkbox>НДС включен</Checkbox>
          </Form.Item>
          <Form.Item label={<LabelTitle text="В наличии, шт" />} name="inStock">
            <Input />
          </Form.Item>
          <Form.Item label={<LabelTitle text="Под заказ, шт" />} name="toOrder">
            <Input />
          </Form.Item>
          <Form.Item
            label={<LabelTitle text="Срок поставки" />}
            name="deliveryTime"
          >
            <Input />
          </Form.Item>
        </Form>
      </PageContent>
      <PageContent>
        <Form
          className={styles.form}
          form={formSupplier}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          onFieldsChange={changedFields =>
            onFormFieldsChange(
              formSupplier,
              setIsDisabled,
              CHECKING_FIELDS_NAME,
              changedFields,
            )
          }
        >
          <Title className={styles.title} tag="h3">
            Информация о поставщике
          </Title>
          <Form.Item label={<LabelTitle text="ИНН" />} name="inn">
            <Input />
          </Form.Item>
          <Form.Item label={<LabelTitle text="Название" />} name="name">
            <Input />
          </Form.Item>

          <Form.Item label={<LabelTitle text="Телефон" />} name="phone">
            <Input />
          </Form.Item>
          <Form.Item label={<LabelTitle text="Почта" />} name="e-mail">
            <Input />
          </Form.Item>
          <Form.Item
            label={<LabelTitle text="Адрес склада" />}
            name="warehouseAddress"
          >
            <Input className={styles.warehouseAddress} />
          </Form.Item>
        </Form>
      </PageContent>
    </div>
  );
};
