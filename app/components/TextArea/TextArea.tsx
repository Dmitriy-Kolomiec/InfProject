import { Form, Input } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import styles from './textArea.module.css';
import React from 'react';

interface IProps {
  label: string;
  placeholder?: string;
}

export const TextAreaMaxLength = ({
  label,
  placeholder = 'Текстовое поле',
}: IProps) => {
  const [maxLetter, setMaxLetter] = useState<number>(0);
  const letterСounting = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMaxLetter(event.target.value.length);
  };
  return (
    <Form.Item
      name="comment"
      label={
        <div className={styles.labelBlock}>
          <span className={styles.label}>{label}</span>
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
      <Input.TextArea
        maxLength={500}
        onChange={letterСounting}
        placeholder={placeholder}
      />
    </Form.Item>
  );
};
