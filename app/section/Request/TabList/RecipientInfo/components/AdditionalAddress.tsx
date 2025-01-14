import { Button, Form, Input, Switch } from 'antd';
import styles from './styles.module.css';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import classNames from 'classnames';
import DeleteIcon from '@/public/deleteBgWhite.svg';

interface IProps {
  fieldName: number;
  fieldKey: number;
  remove: (fieldName: number) => void;
  defaultAddress: number | null;
  handleSwitchChange: (fieldKey: number) => void;
}
export const AdditionalAddress = ({
  fieldName,
  fieldKey,
  remove,
  defaultAddress,
  handleSwitchChange,
}: IProps) => {
  return (
    <>
      <div className={styles.additionalAddress}>
        <Form.Item
          name={[fieldName, 'address']}
          label={<LabelTitle text="Адрес" />}
        >
          <Input placeholder="Не указано" />
        </Form.Item>
        <Button
          className={classNames([styles.deleteFormItem, 'button-white'])}
          onClick={() => remove(fieldName)}
        >
          <DeleteIcon />
        </Button>
      </div>
      <div className={styles.switch}>
        <Form.Item name={[fieldName, 'isDefault']} valuePropName="checked">
          <Switch
            checked={defaultAddress === fieldKey}
            onChange={() => handleSwitchChange(fieldKey)}
          />
        </Form.Item>
        <span>Адрес по умолчанию</span>
      </div>
    </>
  );
};
