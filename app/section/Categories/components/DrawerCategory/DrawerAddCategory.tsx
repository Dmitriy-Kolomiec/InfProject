import { Form, FormInstance, Input } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import styles from './drawer.module.css';
import { onFormFieldsChange } from '@/data/utils.common';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import PageContent from '@/app/components/PageContent/PageContent';
import dynamic from 'next/dynamic';

interface IProps {
  form: FormInstance<any>;
  onFinish: (value: any) => void;
  setIsDisabled: Dispatch<SetStateAction<boolean>>;
}

const Editor = dynamic(() => import('@/app/components/Editor/Editor'), {
  ssr: false,
});
const CHECKING_FIELDS_NAME = ['name', 'label'];

export const DrawerAddCategory = ({
  form,
  onFinish,
  setIsDisabled,
}: IProps) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
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
      <PageContent className={styles.container}>
        <div>
          <Form.Item
            label={<LabelTitle text="Название категории (обязательно)" />}
            name="name"
          >
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
      </PageContent>
    </Form>
  );
};