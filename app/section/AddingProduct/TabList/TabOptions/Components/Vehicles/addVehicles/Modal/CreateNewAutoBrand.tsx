import { Button, Form, Input } from 'antd';
import styles from './modal.module.css';
import { notify, onFormFieldsChange } from '@/data/utils.common';
import { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { IAutoTypes } from '@/interface/addingProduct/options.interface';
import axios from 'axios';

const CHECKING_FIELDS_NAME = ['name', 'label'];
const Editor = dynamic(() => import('@/app/components/Editor/Editor'), {
  ssr: false,
});

interface IProps {
  setNewBrand: Dispatch<SetStateAction<number | undefined>>;
  hideModal: Dispatch<SetStateAction<boolean>>;
  fetchAutoBrands: () => Promise<void>;
  typeId: number | undefined;
}

export default function CreateNewAutoBrand({
  setNewBrand,
  hideModal,
  fetchAutoBrands,
  typeId,
}: IProps) {
  const [form] = Form.useForm();
  const [isDisabledFormSubmit, setIsDisabledFormSubmit] =
    useState<boolean>(true);
  const [isLoader, setIsLoader] = useState<boolean>(false);

  const onFinish = async (value: IAutoTypes) => {
    setIsLoader(true);
    try {
      const { data } = await APIRequest.post(API_ENDPOINTS.ADD_AUTO_BRAND, {
        name: value.name,
        label: value.label,
        description: value.description,
      });
      setNewBrand(data.id);

      form.resetFields();
      if (typeId) {
        fetchAutoBrands();
      }
      setIsLoader(false);
      hideModal(false);
    } catch (error) {
      console.log('Ошибка при создании нового бренда:', error);
      if (axios.isAxiosError(error) && error.message) {
        setIsLoader(false);
        hideModal(false);
        notify('error', {
          message: error.message,
        });
      }
    }
  };
  return (
    <Form
      className={styles.form}
      form={form}
      layout="vertical"
      requiredMark={false}
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
        <Form.Item
          label={<LabelTitle text="Название" />}
          name="name"
          rules={[
            {
              required: true,
              message: 'Поле обязательно для заполнения.',
            },
          ]}
        >
          <Input placeholder="Пример" />
        </Form.Item>

        <Form.Item
          label={<LabelTitle text="Лейбл" />}
          name="label"
          rules={[
            {
              required: true,
              message: 'Поле обязательно для заполнения.',
            },
          ]}
        >
          <Input placeholder="Пример" />
        </Form.Item>
        <Form.Item name="description" label={<LabelTitle text="Описание" />}>
          <Editor placeholder="Введите описание товара" />
        </Form.Item>
      </div>
      <div className={styles.buttonWrapper}>
        <Button
          className={classNames(['button-transparent'])}
          onClick={() => hideModal(false)}
        >
          Отмена
        </Button>
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
