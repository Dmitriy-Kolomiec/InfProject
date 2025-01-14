import { Title } from '@/app/components/Title/Title';
import styles from './recipientInfo.module.css';
import PageContent from '@/app/components/PageContent/PageContent';
import { Button, Drawer, Form, FormInstance, Select } from 'antd';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import PlusIcon from '@/public/plus.svg';
import CloseIcon from '@/public/close.svg';
import classNames from 'classnames';
import ArrowIcon from '@/public/arrowNext.svg';
import { APP_PATHS } from '@/data/paths.data';
import { useEffect } from 'react';
import { DrawerCustomer } from './components/DrawerCustomer';
import { getPopupContainer, onFormFieldsChange } from '@/data/utils.common';
import { AboutCustomer } from './components/AboutCustomer';
import { useRecipientInfo } from './useRecipientInfo.hook';

const CHECKING_FIELDS_NAME = ['customer', 'address'];

interface IProps {
  setIsDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoader?: React.Dispatch<React.SetStateAction<boolean>>;
  formRecipientInfo: FormInstance<any>;
}

export default function RecipientInfo({
  setIsDisabled: setDisabledButtonParent,
  setIsLoader: setIsLoaderButtonParent,
  formRecipientInfo,
}: IProps) {
  const {
    dataRequest,
    form,
    addBuyerForm,
    router,
    openDrawerAddBuyer,
    setOpenDrawerAddBuyer,
    isDisabled,
    setIsDisabled,
    isDisabledBuyerForm,
    setIsDisabledBuyerForm,
    isLoader,
    customerInfo,
    initialCustomer,
    setInitialCustomer,
    selectedCustomer,
    setSelectedCustomer,
    fetchCustomers,
    onFinish,
    onChangeCustomer,
    onClose,
    saveFormAddBuyer,
    onSubmitAddigBuyer,
    newCustomer,
    onSubmitRecipientInfo,
  } = useRecipientInfo({ formRecipientInfo, setIsLoaderButtonParent });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      form.setFieldsValue({
        customer: {
          key: selectedCustomer.customerId,
          value: selectedCustomer.customerId,
          label: selectedCustomer.customerName,
        },
      });
    }
  }, [selectedCustomer, form]);

  useEffect(() => {
    if (setDisabledButtonParent) {
      setDisabledButtonParent(isDisabled);
    }
  }, [isDisabled]);

  useEffect(() => {
    if (dataRequest.customer) {
      const customer = dataRequest.customer;

      setIsDisabled(false);
      setInitialCustomer(customer || null);
      form.setFieldsValue({
        customer: {
          key: customer.customerId,
          value: customer.customerId,
          label: customer.customerName,
        },
        address: {
          key: customer.address.id,
          value: customer.address.id,
          label: customer.address.address,
        },
      });
    }
  }, [dataRequest, form]);

  useEffect(() => {
    if (newCustomer) {
      setSelectedCustomer(newCustomer);
    }
  }, [newCustomer]);

  return (
    <>
      <PageContent className={styles.container}>
        <Title tag="h2">Информация о покупателе</Title>
        <Form
          className={styles.form}
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          onFieldsChange={changedFields =>
            onFormFieldsChange(
              form,
              setIsDisabled,
              CHECKING_FIELDS_NAME,
              changedFields,
            )
          }
        >
          <Form.Item
            name="customer"
            label={<LabelTitle text="Покупатель" />}
            className={styles.formItem}
          >
            <Select
              getPopupContainer={getPopupContainer}
              labelInValue
              showSearch
              filterOption={(input, option) => {
                return option && option.label
                  ? option.label.toLowerCase().includes(input.toLowerCase())
                  : false;
              }}
              filterSort={(optionA, optionB) => {
                return optionA.label
                  ?.toLowerCase()
                  .localeCompare(optionB.label.toLowerCase());
              }}
              className={styles.select}
              placeholder="Выберите из списка"
              dropdownRender={menu => (
                <>
                  {!!customerInfo?.length ? (
                    <>
                      <Button
                        className={classNames([
                          styles.itemSelect,
                          'button-transparent',
                        ])}
                        onClick={() => {
                          setOpenDrawerAddBuyer(true);
                        }}
                      >
                        <PlusIcon />
                        <span>Добавить новый вариант</span>
                      </Button>
                      {menu}
                    </>
                  ) : (
                    <Button
                      className={classNames([
                        styles.itemSelect,
                        'button-transparent',
                      ])}
                      onClick={() => setOpenDrawerAddBuyer(true)}
                    >
                      <PlusIcon />
                      <span>Добавить новый вариант</span>
                    </Button>
                  )}
                </>
              )}
              options={customerInfo?.map(item => ({
                key: item.customerId,
                value: item.customerId,
                label: item.customerName,
              }))}
              onChange={onChangeCustomer}
            />
          </Form.Item>
          {(selectedCustomer || initialCustomer) && (
            <AboutCustomer
              form={form}
              fetchCustomers={fetchCustomers}
              customer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              initialCustomer={initialCustomer}
              setInitialCustomer={setInitialCustomer}
              setIsDisabledNextButton={setIsDisabled}
            />
          )}
        </Form>
      </PageContent>
      <div className={styles.buttonWrapper}>
        <Button
          onClick={() => router.push(APP_PATHS.HOME)}
          className={classNames(['button-transparent'])}
        >
          Отмена
        </Button>
        <Button
          className={classNames(['button-primary', styles.button], {
            [styles.disabledIcon]: isDisabled,
          })}
          onClick={onSubmitRecipientInfo}
          disabled={isDisabled}
          loading={isLoader}
        >
          <span>Продолжить</span>
          <ArrowIcon />
        </Button>
      </div>
      <Drawer
        styles={{
          body: {
            padding: 16,
          },
        }}
        title="Добавление покупателя"
        onClose={onClose}
        open={openDrawerAddBuyer}
        width={480}
        closeIcon={false}
        extra={
          <Button className="button-transparent" onClick={onClose}>
            <CloseIcon />
          </Button>
        }
        footer={
          <Button
            className={classNames(['button-primary', styles.saveButton])}
            htmlType="submit"
            onClick={saveFormAddBuyer}
            disabled={isDisabledBuyerForm}
          >
            Сохранить
          </Button>
        }
      >
        <DrawerCustomer
          form={addBuyerForm}
          onFinish={onSubmitAddigBuyer}
          setIsDisabled={setIsDisabledBuyerForm}
        />
      </Drawer>
    </>
  );
}
