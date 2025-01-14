import { Button, Form, Input } from 'antd';
import styles from './saveRequest.module.css';
import classNames from 'classnames';
import { Title } from '../../../Title/Title';
import { SaveRequestProps } from './SaveRequest.props';

export default function SaveRequestModal({
  className,
  ...props
}: SaveRequestProps) {
  const [form] = Form.useForm();

  const onFinish = (value: any) => {
    console.log('Сохранение заявки: ', value);
  };

  return (
    <div className={classNames([styles.container, className])} {...props}>
      <Title tag="h3" className={styles.title}>
        Редактирование заявки
      </Title>
      <Form
        className={styles.form}
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <div>
          <Form.Item name="nameRequest" label="Название заявки">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="commentRequest" label="Комментарий (необязательно)">
            <Input.TextArea />
          </Form.Item>
        </div>
        <div>
          <Form.Item>
            <Button
              className={classNames(['button-primary', styles.button])}
              htmlType="submit"
            >
              Сохранить
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
