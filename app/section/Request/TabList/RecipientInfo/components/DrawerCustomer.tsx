import { Button, Form, FormInstance, Input, Switch } from 'antd';
import styles from './styles.module.css';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { onFormFieldsChange } from '@/data/utils.common';
import classNames from 'classnames';
import PlusIcon from '@/public/plus.svg';
import InputMask from 'react-input-mask';
import { AdditionalAddress } from './AdditionalAddress';

interface IProps {
  form: FormInstance<any>;
  onFinish: (value: any) => void;
  setIsDisabled?: Dispatch<SetStateAction<boolean>>;
}

const CHECKING_FIELDS_NAME = ['customerName', 'address'];

export const DrawerCustomer = ({ onFinish, form, setIsDisabled }: IProps) => {
  const nodeRef = useRef(null);
  const [defaultAddress, setDefaultAddress] = useState<number | null>(null);

  const handleSwitchChange = (fieldKey: number) => {
    setDefaultAddress(fieldKey);
    form.setFieldsValue({
      address: form.getFieldValue('address'),
      isDefault: fieldKey === -1, // -1 используется для "main" адреса
      addresses: form
        .getFieldValue('addresses')
        ?.map((addr: any, index: number) => ({
          ...addr,
          isDefault: index === fieldKey,
        })),
    });
  };

  return (
    <>
      <Form
        className={styles.form}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        colon={false}
        onFieldsChange={changedFields =>
          setIsDisabled &&
          onFormFieldsChange(
            form,
            setIsDisabled,
            CHECKING_FIELDS_NAME,
            changedFields,
          )
        }
      >
        <Form.Item
          name="customerName"
          label={<LabelTitle text="Наименование покупателя" />}
        >
          <Input placeholder="Не указано" />
        </Form.Item>
        <Form.Item name="address" label={<LabelTitle text="Адрес" />}>
          <Input placeholder="Не указано" />
        </Form.Item>
        <div className={styles.switch}>
          <Form.Item
            name="isDefault"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checked={defaultAddress === -1}
              onChange={() => handleSwitchChange(-1)}
            />
          </Form.Item>
          <span>Адрес по умолчанию</span>
        </div>
        <Form.List name="addresses">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map((field, key) => (
                  <AdditionalAddress
                    key={key}
                    fieldKey={key}
                    fieldName={field.name}
                    remove={remove}
                    defaultAddress={defaultAddress}
                    handleSwitchChange={handleSwitchChange}
                  />
                ))}
                <Button
                  className={classNames(['button-white', styles.addArrress])}
                  onClick={() => add()}
                >
                  <PlusIcon />
                  Добавить ещё адрес
                </Button>
              </>
            );
          }}
        </Form.List>
        <Form.Item name="inn" label={<LabelTitle text="ИНН" />} colon={false}>
          <Input placeholder="Не указано" maxLength={12} minLength={10} />
        </Form.Item>
        <Form.Item
          name="agentName"
          label={<LabelTitle text="Контакное лицо" />}
        >
          <Input placeholder="Не указано" />
        </Form.Item>
        <Form.Item name="agentPhone" label={<LabelTitle text="Телефон" />}>
          <InputMask
            mask="+7(999) 999-99-99"
            placeholder="+7(___) ___-__-__"
            name="agentPhone"
            className={styles.inputNumber}
            ref={nodeRef}
          />
        </Form.Item>
        <Form.Item
          name="agentEmail"
          label={<LabelTitle text="Электронная почта" />}
        >
          <Input placeholder="Не указано" />
        </Form.Item>
      </Form>
    </>
  );
};
