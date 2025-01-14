import { Button, Form, Input, Select } from 'antd';
import styles from './resTimes.module.css';
import classNames from 'classnames';
import { Title } from '../../../Title/Title';
import React from 'react';
import { ChangeSupplierResTimesProps } from './ChangeSupplierResTimes.props';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { getPopupContainer } from '@/data/utils.common';

export default function ChangeSupplierResTimes({}: ChangeSupplierResTimesProps) {
  const [form] = Form.useForm();

  const onFinish = (value: any) => {
    console.log('Изменение времени ответа поставщиков: ', value);
  };
  return (
    <>
      <Title tag="h3" className={styles.title}>
        Изменение времени ответа поставщиков
      </Title>
      <Form
        className={styles.form}
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <div className={styles.changeTimes}>
          <Form.Item
            initialValue={3}
            name="amountTime"
            label={<LabelTitle text="Время ответа" />}
            className={styles.inputNum}
          >
            <Input />
          </Form.Item>
          <Form.Item
            initialValue={{ value: 'hours', label: 'Часы' }}
            name="timeRequest"
            className={styles.select}
          >
            <Select
              getPopupContainer={getPopupContainer}
              popupMatchSelectWidth={true}
              options={[
                {
                  value: 'hour',
                  label: 'Часы',
                },
                {
                  value: 'days',
                  label: 'Дни',
                },
                {
                  value: 'weeks',
                  label: 'Недели',
                },
                {
                  value: 'yourOption',
                  label: 'Свой вариант',
                },
              ]}
            />
          </Form.Item>
        </div>
        <Button
          className={classNames(['button-primary', styles.button])}
          htmlType="submit"
        >
          Сохранить
        </Button>
      </Form>
    </>
  );
}
