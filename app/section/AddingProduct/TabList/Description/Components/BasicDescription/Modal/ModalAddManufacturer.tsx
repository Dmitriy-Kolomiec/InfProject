import classNames from 'classnames';
import { ModalAddManufacturerProps } from './modal.props';
import styles from './modal.module.css';
import { Title } from '@/app/components/Title/Title';
import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';

export default function ModalAddManufacturer({
  isOpen,
  className,
  ...props
}: ModalAddManufacturerProps) {
  const [form] = Form.useForm();
  const [maxLetter, setMaxLetter] = useState<number>(0);

  const letterСounting = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMaxLetter(event.target.value.length);
  };
  const onFinish = (value: any) => {
    console.log(':Добавление производителя: ', value);
    isOpen(false);
  };
  return (
    <div className={classNames([styles.modal, className])} {...props}>
      <Form
        className={styles.form}
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Title className={styles.title} tag="h3">
          Добавление производителя
        </Title>
        <Form.Item
          className={styles.input}
          name="nameManufacturer"
          label={<span className={styles.label}>Название</span>}
        >
          <Input placeholder="Введите название" />
        </Form.Item>
        <Form.Item
          className={styles.input}
          name="labelManufacturer"
          label={<span className={styles.label}>Лейбл</span>}
        >
          <Input placeholder="Введите лейбл" />
        </Form.Item>
        <Form.Item
          name="descriptionManufacturer"
          label={
            <div className={styles.labelBlock}>
              <span className={styles.label}>Описание</span>
              <div
                className={classNames([styles.numLetters], {
                  [styles.disabledCount]: maxLetter >= 500,
                })}
              >
                {maxLetter} / 500
              </div>
            </div>
          }
          className={styles.textArea}
        >
          <Input.TextArea maxLength={500} onChange={letterСounting} />
        </Form.Item>
        <div className={styles.buttonWrapper}>
          <Button className="button-transparent" onClick={() => isOpen(false)}>
            Отмена
          </Button>

          <Button
            className={classNames(['button-primary', styles.button])}
            htmlType="submit"
          >
            Сохранить
          </Button>
        </div>
      </Form>
    </div>
  );
}
