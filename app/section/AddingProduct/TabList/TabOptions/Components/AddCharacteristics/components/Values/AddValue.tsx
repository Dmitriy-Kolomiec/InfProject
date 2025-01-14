import { Button, Form, Input } from 'antd';
import classNames from 'classnames';
import styles from './addValue.module.css';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import dynamic from 'next/dynamic';
import FileUpload from '@/app/components/FileUpload/FileUpload';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { Dispatch, SetStateAction, useState } from 'react';

const Editor = dynamic(() => import('@/app/components/Editor/Editor'), {
  ssr: false,
});

interface IProps {
  removeValue: (index: number | number[]) => void;
  fieldKey: number;
  initialDescription?: string;
  setFileIds:
    | Dispatch<SetStateAction<number[]>>
    | Dispatch<SetStateAction<{ [key: number]: number[] }>>; // Обновленный тип setFileIds
  initialFiles?: any;
}

export default function AddValue({
  removeValue,
  fieldKey,
  initialDescription,
  setFileIds,
  initialFiles,
}: IProps) {
  return (
    <div className={classNames(['neutral-container', styles.addValue])}>
      <Button
        className={classNames([styles.buttonDeleteValue, 'button-transparent'])}
        onClick={() => removeValue(fieldKey)}
      >
        <DeleteIcon />
      </Button>
      <Form.Item required={false} key={fieldKey}>
        <Form.Item
          name={[fieldKey, 'value']}
          label={<LabelTitle text="Значение" />}
        >
          <Input
            className={styles.input}
            placeholder="Числовое или текстовое значение"
          />
        </Form.Item>
        <Form.Item
          name={[fieldKey, 'description']}
          label={<LabelTitle text="Описание" />}
        >
          <Editor
            placeholder="Введите описание товара"
            initialValue={initialDescription}
          />
        </Form.Item>
        <div className={styles.uploadFiles}>
          <FileUpload
            setFileIds={setFileIds}
            initialData={initialFiles}
            urlPath="property"
            valueIndex={fieldKey}
          />
        </div>
      </Form.Item>
    </div>
  );
}
