'use client';
import { Form } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { normalizePhone, notify } from '@/data/utils.common';
import { FormForUser } from './FormForUser';
import axios from 'axios';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { IUser } from '@/interface/user/user.interface';

interface IProps {
  user: IUser;
  hideModal: Dispatch<SetStateAction<boolean>>;
  setUsers: Dispatch<SetStateAction<IUser[]>>;
}

export default function EditUserModal({ user, setUsers, hideModal }: IProps) {
  const [form] = Form.useForm();
  const [checkedRoles, setCheckedRoles] = useState<string[]>([]);
  const [isDisabledFormSubmit, setIsDisabledFormSubmit] =
    useState<boolean>(true);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        roles: user.roles.map(role => role.title),
      });

      setCheckedRoles(user.roles.map(role => role.title));
      setIsDisabledFormSubmit(false);
    }
  }, [user]);

  const onSubmitEditUser = async (value: any) => {
    const requestBody = {
      userId: user.userId,
      phone: normalizePhone(value.phone),
      firstName: value.firstName,
      lastName: value.lastName,
      roles: checkedRoles,
    };

    try {
      const { data } = await APIRequest.put<IUser>(
        API_ENDPOINTS.EDIT_USER,
        requestBody,
      );

      setUsers(prevState =>
        prevState.map(item => (item.userId === data.userId ? data : item)),
      );
    } catch (error) {
      console.error('Ошибка при редактировании нового пользователя:', error);
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
      onFinish={onSubmitEditUser}
      setIsDisabledForm={setIsDisabledFormSubmit}
    />
  );
}
