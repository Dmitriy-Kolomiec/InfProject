import styles from './interactionsUser.module.css';
import { Button, Checkbox, Form, FormInstance, Input, Tooltip } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { getPopupContainer, onFormFieldsChange } from '@/data/utils.common';
import classNames from 'classnames';
import NotificationIcon from '@/public/notification.svg';
import InputMask from 'react-input-mask';

interface IProps {
  form: FormInstance<any>;
  onFinish: (value: any) => Promise<void>;
  setIsDisabledForm: Dispatch<SetStateAction<boolean>>;
  setCheckedRoles: Dispatch<SetStateAction<string[]>>;
  checkedRoles: string[];
  isDisabledForm: boolean;
}

const CHECKING_FIELDS_NAME = ['firstName', 'phone'];
const DESCRIPTION_MODERATOR =
  'Может редактировать товары, категории товаров, характеристики товаров. Не может давать согласие на публикацию контента, добавленного Продавцом.';
const DESCRIPTION_SELLER =
  'Может добавлять товары, характеристики товаров, фотографии и свойства. Весь контент, добавленный Продавцом, должен пройти получить согласование Администратора перед публикацией. Не может редактировать уже добавленный контент (может только добавлять фотографии, свойства, опыт эксплуатации).';
const DESCRIPTION_ADMINISTRATOR =
  'Даёт согласие на публикацию контента, добавленного продавцом. Имеет полный доступ к добавлению и редактированию всех товаров, категорий и характеристик. Может добавлять, редактировать и удалять пользователей.';

export const FormForUser = ({
  form,
  onFinish,
  isDisabledForm,
  setIsDisabledForm,
  setCheckedRoles,
  checkedRoles,
}: IProps) => {
  const onChangeCheckbox = (checkedValues: any) => {
    setCheckedRoles(checkedValues);
  };

  const optionsWithDisabled = [
    {
      label: (
        <div className={styles.label}>
          <span>Менеджер</span>
          <Tooltip
            title={DESCRIPTION_SELLER}
            className={styles.notification}
            getPopupContainer={getPopupContainer}
          >
            <NotificationIcon />
          </Tooltip>
        </div>
      ),
      value: 'manager',
    },
    {
      label: (
        <div className={styles.label}>
          <span>Модератор</span>
          <Tooltip
            title={DESCRIPTION_MODERATOR}
            className={styles.notification}
            getPopupContainer={getPopupContainer}
          >
            <NotificationIcon />
          </Tooltip>
        </div>
      ),
      value: 'moderator',
    },
    {
      label: (
        <div className={styles.label}>
          <span>Администратор</span>
          <Tooltip
            title={DESCRIPTION_ADMINISTRATOR}
            className={styles.notification}
            getPopupContainer={getPopupContainer}
          >
            <NotificationIcon />
          </Tooltip>
        </div>
      ),
      value: 'admin',
      disabled: false,
    },
  ];

  return (
    <Form
      className={styles.form}
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFieldsChange={changedFields =>
        onFormFieldsChange(
          form,
          setIsDisabledForm,
          CHECKING_FIELDS_NAME,
          changedFields,
        )
      }
    >
      <div>
        <Form.Item label="Имя" name="firstName">
          <Input className={styles.input} placeholder="Имя" />
        </Form.Item>
        <Form.Item label="Фамилия" name="lastName">
          <Input className={styles.input} placeholder="Фамилия" />
        </Form.Item>
        <Form.Item label="" name="roles">
          <Checkbox.Group
            className={styles.checkboxGroup}
            options={optionsWithDisabled}
            onChange={onChangeCheckbox}
          />
        </Form.Item>

        <Form.Item label="Телефон" name="phone">
          <InputMask
            mask={'+7 (999) 999-99-99'}
            value="11"
            className="input-number"
          />
        </Form.Item>
      </div>
      <Button
        htmlType="submit"
        className={classNames([styles.button, 'button-primary'])}
        disabled={isDisabledForm || !checkedRoles.length}
      >
        Сохранить
      </Button>
    </Form>
  );
};
