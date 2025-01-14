import classNames from 'classnames';
import React from 'react';
import { TabDescriptionProps } from './description.props';
import styles from './description.module.css';
import PageContent from '@/app/components/PageContent/PageContent';
import { Button, Form } from 'antd';
import BasicDescription from './Components/BasicDescription/BasicDescription';
import ArrowIcon from '@/public/arrowNext.svg';
import { onFormFieldsChange } from '@/data/utils.common';
import NotificationDanger from '@/app/components/Notification/Danger';
import { useDescription } from './useDescription.hook';

const CHECKING_FIELDS_NAME = ['name'];
export default function TabDescription({
  className,
}: TabDescriptionProps): React.ReactElement {
  const {
    form,
    router,
    isDisabled,
    setIsDisabled,
    productId,
    setFileIdsDescription,
    onCreateSubmitDescription,
    onEditSubmitDescription,
    isLoader,
  } = useDescription();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={productId ? onEditSubmitDescription : onCreateSubmitDescription}
      requiredMark={false}
      className={className}
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
        <BasicDescription setFileIdsDescription={setFileIdsDescription} />
      </PageContent>
      {isDisabled && (
        <NotificationDanger
          text="Не заполнены обязательные поля."
          className={styles.notification}
        />
      )}
      <div className={styles.buttonWrapper}>
        <Button
          onClick={router.back}
          className={classNames(['button-transparent'])}
        >
          Отмена
        </Button>
        <Button
          className={classNames(['button-primary', styles.button])}
          htmlType="submit"
          disabled={isDisabled}
          loading={isLoader}
        >
          <span>Продолжить</span>
          <ArrowIcon />
        </Button>
      </div>
    </Form>
  );
}
