'use client';
import classNames from 'classnames';
import { FeedbackSupplierProps } from './feedbackSupplier.props';
import styles from './feedbackSupplier.module.css';
import { Button, Checkbox, Divider, Form, Rate } from 'antd';
import { TextAreaMaxLength } from '../TextArea/TextArea';
import { onFormFieldsChange } from '@/data/utils.common';
import React, { useState } from 'react';
import { Title } from '../Title/Title';

export default function FeedbackSupplier({
  className,
}: FeedbackSupplierProps): React.ReactElement {
  const [form] = Form.useForm();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  // Проверка на обязательное заполнение полей. Иначе кнопка disabled

  const onFinish = (value: any) => {
    console.log('Отправка отзыва о поставщике: ', value);
  };

  const CHECKING_FIELDS_NAME = ['rating', 'comment'];

  return (
    <Form
      className={classNames([styles.form, className])}
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFieldsChange={changedFields =>
        onFormFieldsChange(
          form,
          setIsDisabled,
          CHECKING_FIELDS_NAME,
          changedFields,
        )
      }
    >
      <Title tag="h3">Отзыв о поставщике</Title>
      <Divider />
      <div className={styles.rating}>
        <Form.Item name="rating">
          <Rate />
        </Form.Item>
        <span className={styles.ratingText}>Оцените поставщика</span>
      </div>
      <TextAreaMaxLength
        label="Комментарий"
        placeholder="Опишите достоинства или недостатки работы 
с поставщиком"
      />
      <Form.Item name="anonymously" valuePropName="checked">
        <Checkbox>Опубликовать отзыв анонимно</Checkbox>
      </Form.Item>
      <Button
        htmlType="submit"
        className={classNames([styles.button, 'button-primary'])}
        disabled={isDisabled}
      >
        Отправить
      </Button>
    </Form>
  );
}
