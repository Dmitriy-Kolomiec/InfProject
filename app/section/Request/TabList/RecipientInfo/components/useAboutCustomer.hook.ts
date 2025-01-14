import { Form } from 'antd';
import APIRequest from '@/data/api/api.utils';
import { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';
import { notify } from '@/data/utils.common';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { IAddress, ICustomer } from '@/interface/request/request.interface';

interface IProps {
  customer?: ICustomer | null;
  setSelectedCustomer: Dispatch<SetStateAction<ICustomer | null>>;
  fetchCustomers: () => Promise<void>;
}

export const useAboutCustomer = ({
  customer,
  setSelectedCustomer,
  fetchCustomers,
}: IProps) => {
  const [address, setAddress] = useState<IAddress[]>();
  const [editForm] = Form.useForm();
  const [openDrawerEditCustomer, setOpenDrawerEditCustomer] =
    useState<boolean>(false);
  const [isOpenDeleteCustomer, setIsOpenDeleteCustomer] =
    useState<boolean>(false);

  const onCloseDrawer = () => {
    setOpenDrawerEditCustomer(false);
  };

  const saveFormEditCustomer = () => {
    editForm.submit();
    onCloseDrawer();
  };

  const onSubmitEditCustomer = async (value: any) => {
    const idDefaultAddress = editForm.getFieldValue('idDefaultAddress');
    const addresses = [
      {
        address: value.address,
        isDefault: value.isDefault || false,
        id: idDefaultAddress,
      },
    ];

    const formattedAddresses = value.addresses
      ? addresses.concat(
          value.addresses.map((addr: any) => ({
            address: addr.address,
            isDefault: addr.isDefault || false,
            id: addr.id,
          })),
        )
      : addresses;

    const requestBody = {
      id: customer?.customerId,
      inn: value.inn,
      customerName: value.customerName,
      agentName: value.agentName,
      agentPhone: value.agentPhone,
      agentEmail: value.agentEmail,
      addresses: formattedAddresses,
    };
    try {
      const { data } = await APIRequest.put(
        API_ENDPOINTS.EDIT_CUSTOMER,
        requestBody,
      );
      setSelectedCustomer(data);
      editForm.resetFields();
      fetchCustomers();
      setOpenDrawerEditCustomer(false);
    } catch (error) {
      console.error('Ошибка при редактировании покупателя:', error);
      if (axios.isAxiosError(error) && error.message) {
        notify('error', {
          message: error.message,
        });
      }
    }
  };

  return {
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
  };
};
