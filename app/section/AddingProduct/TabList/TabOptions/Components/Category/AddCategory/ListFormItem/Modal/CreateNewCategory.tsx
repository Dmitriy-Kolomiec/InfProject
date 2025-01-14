import { Button, Form, Input } from 'antd';
import styles from './createNewCategory.module.css';
import { notify, onFormFieldsChange } from '@/data/utils.common';
import { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { API_ENDPOINTS } from '@/data/api/api.data';
import APIRequest from '@/data/api/api.utils';
import axios from 'axios';

const CHECKING_FIELDS_NAME = ['name', 'label'];
const Editor = dynamic(() => import('@/app/components/Editor/Editor'), {
  ssr: false,
});

interface IProps {
  setNewCategory: Dispatch<SetStateAction<number | undefined>>;
  hideModal: Dispatch<SetStateAction<boolean>>;
  fetchCategories?: () => Promise<void>;
}

interface IFormValues {
  name: string;
  label: string;
  description?: string;
}

export default function CreateNewCategory({
  setNewCategory,
  hideModal,
  fetchCategories,
}: IProps) {
  const [form] = Form.useForm();
  const [isDisabledFormSubmit, setIsDisabledFormSubmit] =
    useState<boolean>(true);
  const [isLoader, setIsLoader] = useState<boolean>(false);

  const onSubmitFinish = async (value: IFormValues) => {
    setIsLoader(true);
    const { name, label, description } = value;
    const requestBody = {
      name,
      label,
      description,
      parentId: null,
    };
    try {
      const { data } = await APIRequest.post<any>(
        API_ENDPOINTS.ADD_CATEGORY,
        requestBody,
      );
      setNewCategory(data.id);
      setIsLoader(false);
      form.resetFields();
      hideModal(false);
      fetchCategories?.();
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error) && error.message) {
        hideModal(false);
        notify('error', {
          message: error.message,
        });
      }
      setIsLoader(false);
    }
  };
  return (
    <Form
      className={styles.form}
      form={form}
      layout="vertical"
      onFinish={onSubmitFinish}
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
          loading={isLoader}
        >
          Сохранить
        </Button>
      </div>
    </Form>
  );
}
