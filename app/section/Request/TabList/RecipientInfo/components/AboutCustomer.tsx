import { Button, Drawer, Form, FormInstance, Modal, Select } from 'antd';
import styles from './components.module.css';
import EditIcon from '@/public/editIcon.svg';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import classNames from 'classnames';
import APIRequest from '@/data/api/api.utils';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { getPopupContainer } from '@/data/utils.common';
import CloseIcon from '@/public/close.svg';
import { DrawerCustomer } from './DrawerCustomer';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { DeleteCustomerModal } from './ModalDeleteCustomer';
import { ICustomer } from '@/interface/request/request.interface';
import { useAboutCustomer } from './useAboutCustomer.hook';

interface IProps {
  form: FormInstance<any>;
  customer?: ICustomer | null;
  setSelectedCustomer: Dispatch<SetStateAction<ICustomer | null>>;
  fetchCustomers: () => Promise<void>;
  initialCustomer: ICustomer | null;
  setInitialCustomer: Dispatch<SetStateAction<ICustomer | null>>;
  setIsDisabledNextButton: Dispatch<SetStateAction<boolean>>;
}

export const AboutCustomer = ({
  form,
  customer,
  setSelectedCustomer,
  fetchCustomers,
  initialCustomer,
  setInitialCustomer,
  setIsDisabledNextButton,
}: IProps) => {
  const {
    address,
    setAddress,
    editForm,
    openDrawerEditCustomer,
    isOpenDeleteCustomer,
    saveFormEditCustomer,
    onSubmitEditCustomer,
    onCloseDrawer,
    setOpenDrawerEditCustomer,
    setIsOpenDeleteCustomer,
  } = useAboutCustomer({
    customer,
    setSelectedCustomer,
    fetchCustomers,
  });

  const aboutCustomer: ICustomer | null | undefined =
    initialCustomer || customer;

  useEffect(() => {
    if (aboutCustomer?.customerId) {
      const fetchGetCustomer = async () => {
        const { data } = await APIRequest.get(
          API_ENDPOINTS.GET_CUSTOMER(aboutCustomer?.customerId),
        );
        setAddress(data.addresses);
      };
      fetchGetCustomer();
    }
  }, [initialCustomer, customer]);

  useEffect(() => {
    if (openDrawerEditCustomer) {
      const defaultAddress = aboutCustomer?.addresses?.find(
        address => address.isDefault,
      );
      const otherAddresses = aboutCustomer?.addresses?.filter(
        address => !address.isDefault,
      );

      editForm.setFieldsValue({
        customerName: customer?.customerName,
        inn: customer?.inn,
        agentName: customer?.agentName,
        agentPhone: customer?.agentPhone,
        agentEmail: customer?.agentEmail,
        idDefaultAddress: defaultAddress ? defaultAddress.id : null,
        address: defaultAddress ? defaultAddress.address : '',
        isDefault: !!defaultAddress,
        addresses:
          otherAddresses?.map(address => ({
            address: address.address,
            id: address.id,
            isDefault: address.isDefault || false,
          })) || [],
      });
    }
  }, [openDrawerEditCustomer, customer, editForm]);

  useEffect(() => {
    if (address?.length === 1) {
      form.setFieldsValue({
        address: address[0].id,
      });
      setIsDisabledNextButton(false);
    }
  }, [address]);

  return (
    <>
      <Form.Item name="address">
        <Select
          getPopupContainer={getPopupContainer}
          className={styles.select}
          placeholder="Выберите из списка"
          options={address?.map(item => ({
            key: item.id,
            value: item.id,
            label: item.address,
          }))}
        />
      </Form.Item>
      <div className={styles.block}>
        <span className={styles.neutralText}>ИНН</span>
        <span>{aboutCustomer?.inn}</span>
      </div>
      <div className={styles.block}>
        <span className={styles.neutralText}>Контакное лицо</span>
        <span>{aboutCustomer?.agentName}</span>
      </div>
      <div className={styles.block}>
        <span className={styles.neutralText}>Телефон</span>
        <span>{aboutCustomer?.agentPhone}</span>
      </div>
      <div className={styles.block}>
        <span className={styles.neutralText}>Электронная почта</span>
        <span>{aboutCustomer?.agentEmail}</span>
      </div>
      <div className={styles.buttonWrapper}>
        <Button
          className={classNames(['button-white', styles.button])}
          onClick={() => setOpenDrawerEditCustomer(true)}
        >
          <EditIcon />
          Редактировать
        </Button>
        <Button
          className={classNames(['button-white', styles.button])}
          onClick={() => setIsOpenDeleteCustomer(true)}
        >
          <DeleteIcon />
          Удалить
        </Button>
      </div>
      <Drawer
        styles={{
          body: {
            padding: 16,
          },
        }}
        title="Редактирование покупателя"
        onClose={onCloseDrawer}
        open={openDrawerEditCustomer}
        width={480}
        closeIcon={false}
        extra={
          <Button className="button-transparent" onClick={onCloseDrawer}>
            <CloseIcon />
          </Button>
        }
        footer={
          <Button
            className={classNames(['button-primary', styles.saveButton])}
            htmlType="submit"
            onClick={saveFormEditCustomer}
          >
            Сохранить
          </Button>
        }
      >
        <DrawerCustomer form={editForm} onFinish={onSubmitEditCustomer} />
      </Drawer>
      <Modal
        open={isOpenDeleteCustomer}
        onCancel={() => setIsOpenDeleteCustomer(false)}
        centered
        className={styles.modalDelete}
        title="Удалить покупателя?"
        footer={null}
        width={340}
      >
        <DeleteCustomerModal
          id={aboutCustomer?.customerId}
          customerName={aboutCustomer?.customerName}
          hideModal={setIsOpenDeleteCustomer}
          form={form}
          setSelectedCustomer={setSelectedCustomer}
          setInitialCustomer={setInitialCustomer}
          fetchCustomers={fetchCustomers}
        />
      </Modal>
    </>
  );
};
