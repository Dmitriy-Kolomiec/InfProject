'use client';
import classNames from 'classnames';
import { ChatSupplierProps } from './chatSupplier.props';
import styles from './chatSupplier.module.css';
import { Title } from '../Title/Title';
import {
  Button,
  Divider,
  Form,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from 'antd';
import React, { useState } from 'react';
import { TextAreaMaxLength } from '../TextArea/TextArea';
import AttachIcon from '@/public/attach.svg';
import LeafIcon from '@/public/leaf.svg';
import { onFormFieldsChange } from '@/data/utils.common';
import CloseIcon from '@/public/close.svg';

export default function ChatSupplier({
  className,
}: ChatSupplierProps): React.ReactElement {
  const [form] = Form.useForm();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const CHECKING_FIELDS_NAME = ['comment'];

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const onFinish = (value: any) => {
    console.log('Отправка отзыва о поставщике: ', value);
  };

  const props: UploadProps = {
    name: 'file',
    action: 'localhost:3000',
    method: 'POST',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

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
      <Title tag="h3">Чат с поставщиком</Title>
      <Divider />
      <TextAreaMaxLength label="Сообщение" placeholder="Текстовое поле" />
      {fileList.map((file, index) => (
        <div key={index} className={styles.fileList}>
          <div className={styles.nameFile}>
            <LeafIcon />
            <span>{file.name}</span>
          </div>
          <Button
            className={styles.removeBtn}
            icon={<CloseIcon />}
            // TODO Заглушка
            onClick={() => setFileList([])}
          />
        </div>
      ))}
      <div className={styles.buttonWrapper}>
        <Upload
          {...props}
          iconRender={LeafIcon}
          fileList={fileList}
          onChange={handleChange}
          showUploadList={false}
        >
          <Button className={styles.button} icon={<AttachIcon />}>
            Добавить файл
          </Button>
        </Upload>
        <Button
          htmlType="submit"
          className={classNames([styles.button, 'button-primary'])}
          disabled={isDisabled}
        >
          Отправить
        </Button>
      </div>
    </Form>
  );
}
