'use client';
import { Form } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import { normalizePhone, notify } from '@/data/utils.common';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import axios from 'axios';
import { FormForUser } from './FormForUser';
import { IUser } from '@/interface/user/user.interface';

interface IProps {
  hideModal: Dispatch<SetStateAction<boolean>>;
  setUsers: Dispatch<SetStateAction<IUser[]>>;
}

export default function AddUserModal({ hideModal, setUsers }: IProps) {
  const [form] = Form.useForm();
  const [checkedRoles, setCheckedRoles] = useState<string[]>([]);
  const [isDisabledFormSubmit, setIsDisabledFormSubmit] =
    useState<boolean>(true);

  const onSubmitCreateUser = async (value: any) => {
    const requestBody = {
      phone: normalizePhone(value.phone),
      firstName: value.firstName,
      lastName: value.lastName,
      roles: checkedRoles,
    };

    try {
      const { data } = await APIRequest.post<IUser>(
        API_ENDPOINTS.ADD_USER,
        requestBody,
      );
      setUsers(prevState => [...(prevState || []), data]);
    } catch (error) {
      console.error('Ошибка при создании нового пользователя:', error);
      if (axios.isAxiosError(error) && error.message) {
        notify('error', {
          message: error.message,
        });
      }
    } finally {
      form.resetFields();
      hideModal(false);
    }
  };

  return (
    <FormForUser
      form={form}
      checkedRoles={checkedRoles}
      isDisabledForm={isDisabledFormSubmit}
      setCheckedRoles={setCheckedRoles}
      onFinish={onSubmitCreateUser}
      setIsDisabledForm={setIsDisabledFormSubmit}
    />
  );
}
