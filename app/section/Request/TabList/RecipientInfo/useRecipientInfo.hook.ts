import { Form, FormInstance } from 'antd';
import { useRouter } from 'next/navigation';
import { APP_PATHS } from '@/data/paths.data';
import { useContext, useState } from 'react';
import { notify } from '@/data/utils.common';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import axios from 'axios';
import { RequestContext } from '@/context/Request/request.context';
import { ICustomer } from '@/interface/request/request.interface';

interface IAddCustomerForm {
  customerName: string;
  inn: string;
  address: string;
  isDefault: boolean;
  addresses: [{ address: string; isDefault: boolean }];
  agentName: string;
  agentPhone: string;
  agentEmail: string;
}

interface IProps {
  setIsLoaderButtonParent?: React.Dispatch<React.SetStateAction<boolean>>;
  formRecipientInfo: FormInstance<any>;
}

export const useRecipientInfo = ({
  formRecipientInfo,
  setIsLoaderButtonParent,
}: IProps) => {
  const { dataRequest } = useContext(RequestContext);
  // const [form] = Form.useForm();

  const [addBuyerForm] = Form.useForm();
  const router = useRouter();
  const [openDrawerAddBuyer, setOpenDrawerAddBuyer] = useState<boolean>(false);
  const [isDisabledBuyerForm, setIsDisabledBuyerForm] = useState<boolean>(true);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [customerInfo, setCustomersInfo] = useState<ICustomer[]>();
  const [initialCustomer, setInitialCustomer] = useState<ICustomer | null>(
    dataRequest.customer || null,
  );

  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(
    null,
  );
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [newCustomer, setNewCustomer] = useState<ICustomer | null>();

  const isEmptyDataRequest = !!Object.keys(dataRequest).length;

  const fetchCustomers = async () => {
    const { data } = await APIRequest.get<ICustomer[]>(
      API_ENDPOINTS.GET_CUSTOMERS,
    );
    setCustomersInfo(data);
  };

  const onSubmitRecipientInfo = () => {
    console.log('onSubmitRecipientInfo');
    formRecipientInfo.submit();
  };

  const onFinish = async (value: any) => {
    setIsLoaderButtonParent?.(true);
    setIsLoader(true);
    if (!isEmptyDataRequest) {
      const requestBody = {
        customerId: value.customer.value,
        addressId: value.address,
      };
      try {
        const { data } = await APIRequest.post(
          API_ENDPOINTS.ADD_REQUEST,
          requestBody,
        );
        if (data) {
          localStorage.setItem('request', JSON.stringify(data));

          router.push(
            APP_PATHS.REQUESTS_VIEW(data.requestId) +
              '?' +
              new URLSearchParams({
                tab: 'addition',
              }).toString(),
          );
          // setIsLoader(false);
        }
        // setIsLoader(false);
      } catch (error) {
        console.error('Ошибка при создании заявки:', error);
        if (axios.isAxiosError(error) && error.message) {
          notify('error', {
            message: error.message,
          });
        }
      } finally {
        setIsLoaderButtonParent?.(false);
        setIsLoader(false);
      }
    } else {
      alert(
        'Добавить логику редактирования при изменении данных о пользователе',
      );

      if (dataRequest?.request?.id) {
        router.push(
          APP_PATHS.REQUESTS_VIEW(dataRequest.request.id) +
            '?' +
            new URLSearchParams({
              tab: 'addition',
            }).toString(),
        );
      }
    }
  };

  const onChangeCustomer = (value: {
    key: number;
    value: number;
    label: string;
  }) => {
    const customer =
      customerInfo?.find(c => c.customerId === value.value) || null;
    setSelectedCustomer(customer);
    formRecipientInfo.resetFields(['address']);
    setIsDisabled(true);
  };

  const onClose = () => {
    setOpenDrawerAddBuyer(false);
  };

  const saveFormAddBuyer = () => {
    addBuyerForm.submit();
    onClose();
  };

  const onSubmitAddigBuyer = async (value: IAddCustomerForm) => {
    const addresses = [
      {
        address: value.address,
        isDefault: value.isDefault || false,
      },
    ];

    const formattedAddresses = value.addresses
      ? addresses.concat(
          value.addresses.map(addr => ({
            address: addr.address,
            isDefault: addr.isDefault || false,
          })),
        )
      : addresses;

    const requestBody = {
      inn: value.inn,
      customerName: value.customerName,
      agentName: value.agentName,
      agentPhone: value.agentPhone,
      agentEmail: value.agentEmail,
      addresses: formattedAddresses,
    };
    try {
      const { data } = await APIRequest.post(
        API_ENDPOINTS.ADD_CUSTOMER,
        requestBody,
      );
      addBuyerForm.resetFields();
      fetchCustomers();
      if (data) {
        setNewCustomer(data);
      }
    } catch (error) {
      console.error('Ошибка при создании покупателя:', error);
      if (axios.isAxiosError(error) && error.message) {
        notify('error', {
          message: error.message,
        });
      }
    }
  };

  return {
    dataRequest,
    form: formRecipientInfo,
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
  };
};
