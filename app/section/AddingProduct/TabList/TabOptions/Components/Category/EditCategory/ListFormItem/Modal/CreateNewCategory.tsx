import { Button, Form, Input } from 'antd';
import styles from './createNewCategory.module.css';
import { onFormFieldsChange } from '@/data/utils.common';
import { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';

const CHECKING_FIELDS_NAME = ['name', 'label'];
const Editor = dynamic(() => import('@/app/components/Editor/Editor'), {
  ssr: false,
});

interface IProps {
  setIsOpenModalCreateCategory: Dispatch<SetStateAction<boolean>>;
}

export default function CreateNewCategory({
  setIsOpenModalCreateCategory,
}: IProps) {
  const [form] = Form.useForm();
  const [isDisabledFormSubmit, setIsDisabledFormSubmit] =
    useState<boolean>(true);

  const onFinish = (value: any) => {
    console.log('Новая категория: ', value);
    form.resetFields();
    setIsOpenModalCreateCategory(false);
  };
  return (
    <Form
      className={styles.form}
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFieldsChange={changedFields =>
        onFormFieldsChange(
          form,
          setIsDisabledFormSubmit,
          CHECKING_FIELDS_NAME,
          changedFields,
        )
      }
    >
      <div>
        <Form.Item label={<LabelTitle text="Название" />} name="name">
          <Input
            className={styles.input}
            placeholder="Введите название категории"
          />
        </Form.Item>
        <Form.Item label={<LabelTitle text="Лейбл" />} name="label">
          <Input className={styles.input} placeholder="Введите значение" />
        </Form.Item>
        <Form.Item name="description" label={<LabelTitle text="Описание" />}>
          <Editor placeholder="Введите описание товара" />
        </Form.Item>
      </div>
      <div className={styles.buttonWrapper}>
        <Button className={classNames(['button-transparent'])}>Отмена</Button>
        <Button
          htmlType="submit"
          className={classNames([styles.button, 'button-primary'])}
          disabled={isDisabledFormSubmit}
        >
          Сохранить
        </Button>
      </div>
    </Form>
  );
}
