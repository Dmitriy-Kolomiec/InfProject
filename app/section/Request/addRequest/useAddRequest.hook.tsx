import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ITabList } from '@/app/components/TabList/tabList.props';
import { Form } from 'antd';

export const useAddRequest = () => {
  const [isOpenModalDeletion, setIsOpenModalDeletion] =
    useState<boolean>(false);
  const searchParams = useSearchParams();
  const activeTab: string | null = searchParams.get('tab');

  const tabList: ITabList[] = [
    { title: 'Информация о покупателе', nameQuery: 'recipientInfo' },
    { title: 'Добавление позиций', nameQuery: 'addition' },
    { title: ' Формирование заказа', nameQuery: 'formation' },
    { title: 'Оформление заказа', nameQuery: 'placing' },
  ];

  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoader, setIsLoader] = useState(false);
  const [formRecipientInfo] = Form.useForm();

  const onSubmitRecipientInfo = () => {
    formRecipientInfo.submit();
  };

  return {
    isOpenModalDeletion,
    setIsOpenModalDeletion,
    activeTab,
    tabList,
    isDisabled,
    setIsDisabled,
    isLoader,
    setIsLoader,
    formRecipientInfo,
    onSubmitRecipientInfo,
  };
};
