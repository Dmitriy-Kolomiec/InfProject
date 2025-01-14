'use client';
import { Breadcrumb, Button, Form, Input, Modal, Spin, Table } from 'antd';
import { SearchProduct } from '../Catalogs/components/searchProduct/SearchProduct';
import styles from './cart.module.css';
import Link from 'next/link';
import { APP_PATHS } from '@/data/paths.data';
import { Title } from '@/app/components/Title/Title';
import { useEffect } from 'react';
import { onFormFieldsChange } from '@/data/utils.common';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import InputMask from 'react-input-mask';
import PageContent from '@/app/components/PageContent/PageContent';
import classNames from 'classnames';
import { LoadingOutlined } from '@ant-design/icons';
import { ModalOrderSuccessful } from './components/Modal/ModalOrderSuccessful';
import { useCart } from './useCart.hook';

export default function CartPageContent() {
  const {
    isLoadingOrder,
    isLoadingData,
    setIsLoadingData,
    isOpenModalOrderSuccessful,
    isDisabledFormSubmit,
    setIsDisabledFormSubmit,
    phone,
    form,
    nodeRef,
    cartProducts,
    onFinishSubmit,
    changePhone,
    columns,
    closeModal,
    CHECKING_FIELDS_NAME,
    validateFormMessages,
    isStatusOrder,
  } = useCart();

  useEffect(() => {
    setIsLoadingData(false);
  }, []);

  return (
    <>
      <SearchProduct />
      <Breadcrumb
        className="bread-crumb"
        items={[
          {
            title: (
              <Link className="bread-crumb_link" href={APP_PATHS.CART}>
                Корзина
              </Link>
            ),
          },
        ]}
      />

      <Title tag="h2">Оформление заказа</Title>

      {isLoadingData ? (
        <>
          <div className={styles.loader}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        </>
      ) : (
        <>
          {!!cartProducts.length ? (
            <>
              <PageContent>
                <Table
                  pagination={false}
                  size="small"
                  showSorterTooltip={false}
                  columns={columns}
                  rowKey={record => `${record.partNumberId}`}
                  dataSource={cartProducts}
                  bordered
                  className={styles.table}
                />
              </PageContent>
              <PageContent>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinishSubmit}
                  requiredMark={false}
                  onFieldsChange={changedFields =>
                    onFormFieldsChange(
                      form,
                      setIsDisabledFormSubmit,
                      CHECKING_FIELDS_NAME,
                      changedFields,
                    )
                  }
                  className={styles.form}
                  validateMessages={validateFormMessages}
                >
                  <Form.Item
                    label={<LabelTitle text="Контакное лицо" />}
                    name="name"
                  >
                    <Input className={styles.input} placeholder="ФИО" />
                  </Form.Item>
                  <div className={styles.flexContainer}>
                    <LabelTitle text="Телефон" />
                    <InputMask
                      mask="+7(999) 999-99-99"
                      placeholder="+7(___) ___-__-__"
                      name="phone"
                      className={styles.inputNumber}
                      ref={nodeRef}
                      value={phone}
                      onChange={changePhone}
                    />
                  </div>
                  <Form.Item
                    name="email"
                    label={<LabelTitle text="Электронная почта" />}
                    rules={[{ type: 'email' }]}
                  >
                    <Input placeholder="Введите адрес электронной почты" />
                  </Form.Item>
                  <Button
                    className={classNames([
                      'button-primary',
                      styles.submitButton,
                    ])}
                    htmlType="submit"
                    disabled={isDisabledFormSubmit && phone.length !== 12}
                    loading={isLoadingOrder}
                  >
                    {isStatusOrder ? 'Заказ оформлен' : 'Оформить заказ'}
                  </Button>
                </Form>
              </PageContent>
            </>
          ) : (
            <div className={styles.notData}>Товаров нет</div>
          )}
        </>
      )}
      <Modal
        open={isOpenModalOrderSuccessful}
        onCancel={closeModal}
        centered
        className={styles.modalDelete}
        title="Заказ успешно оформлен"
        footer={null}
        width={480}
      >
        <ModalOrderSuccessful hideModal={closeModal} />
      </Modal>
    </>
  );
}
