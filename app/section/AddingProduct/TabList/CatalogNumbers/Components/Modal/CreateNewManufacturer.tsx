import { Button, Form, Input } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import styles from './modal.module.css';
import dynamic from 'next/dynamic';
import { notify, onFormFieldsChange } from '@/data/utils.common';
import classNames from 'classnames';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { IAddManufacturer } from '@/interface/addingProduct/addPartNumber.interface';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import axios from 'axios';

const CHECKING_FIELDS_NAME = ['name'];

const Editor = dynamic(() => import('@/app/components/Editor/Editor'), {
  ssr: false,
});

interface IProps {
  setNewManufacturerId?: Dispatch<SetStateAction<number | undefined>>;
  hideModal: Dispatch<SetStateAction<boolean>>;
  fetchManufacturers: () => Promise<void>;
}
export default function CreateNewManufacturer({
  setNewManufacturerId,
  hideModal,
  fetchManufacturers,
}: IProps) {
  const [form] = Form.useForm();
  const [isDisabledFormSubmit, setIsDisabledFormSubmit] =
    useState<boolean>(true);
  const [isLoader, setIsLoader] = useState<boolean>(false);

  const onFinish = async (value: IAddManufacturer) => {
    setIsLoader(true);
    try {
      const { data } = await APIRequest.post(
        API_ENDPOINTS.ADD_MANUFACTURER,
        value,
      );
      setNewManufacturerId?.(data.id);
      form.resetFields();
      setIsLoader(false);
      hideModal(false);
      fetchManufacturers();
    } catch (error) {
      console.error('Ошибка при создании нового производителя:', error);
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
      onFinish={onFinish}
      requiredMark={false}
      onFieldsChange={changedFields =>
        onFormFieldsChange(
          form,
          setIsDisabledFormSubmit,
          CHECKING_FIELDS_NAME,
          changedFields,
        )
      }
    >
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
      <Form.Item name="description" label={<LabelTitle text="Описание" />}>
        <Editor placeholder="Введите описание товара" />
      </Form.Item>
      <div className={styles.buttonWrapper}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
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
