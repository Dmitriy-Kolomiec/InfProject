import { useRef, useState } from 'react';
import React from 'react';
import { Form } from 'antd';
import { cleanPhoneNumber } from '@/data/utils.common';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getProfileUser, login } from '@/store/slice/authSlice';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { IGetCode } from '@/interface/auth/auth.interface';
import { useRouter } from 'next/navigation';
import { APP_PATHS } from '@/data/paths.data';
import { IUser } from '@/interface/user/user.interface';

export const useAuthorization = () => {
  const CHECKING_FIELDS_NAME = ['code'];
  const nodeRef = useRef(null);
  const [form] = Form.useForm();
  const [phone, setPhone] = useState<string>('');
  const [isGetCode, setIsGetCode] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [isDisabledFormSubmit, setIsDisabledFormSubmit] =
    useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();
  const [fpHash, setFpHash] = useState<string>('');
  const router = useRouter();
  const [authAttempt, setAuthAttempt] = useState<number | null>(null);
  const [initialSeconds, setInitialSeconds] = useState(0);
  const [isErrorGetCode, setIsErrorGetCode] = useState<boolean>(false);
  const accessToken = useSelector((s: RootState) => s.auth.accessToken);
  const authError = useSelector((s: RootState) => s.auth.error);

  const isPhoneComplete = (phone: any) => {
    const cleanedPhone = cleanPhoneNumber(phone);
    return cleanedPhone.length === 12;
  };

  const changePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const getAuthCode = async (phone: string) => {
    try {
      const { data } = await APIRequest.post<IGetCode>(API_ENDPOINTS.GET_CODE, {
        phone: cleanPhoneNumber(phone),
      });
      const nowDate = new Date();
      const nowTime = nowDate.getTime();
      const authAttemptTimestamp = new Date(data?.timestamp);
      const timeDiff = authAttemptTimestamp.getTime() - nowTime;
      setAuthAttempt(timeDiff > 0 ? Math.round(timeDiff / 1000) : 0);
      setInitialSeconds(timeDiff > 0 ? Math.round(timeDiff / 1000) : 0);
      setIsGetCode(data.isCode);
      setShowCode(data.isCode);
      setIsErrorGetCode(false);
    } catch (error: any) {
      console.error('Ошибка:', error);
      setIsErrorGetCode(!!error);
    }
  };

  const onFinishSubmitAuth = async (value: any) => {
    const requestBody = {
      code: value.code,
      phone: cleanPhoneNumber(phone),
      fpHash: fpHash,
    };

    try {
      const actionResult = await dispatch(login(requestBody));
      if (login.fulfilled.match(actionResult)) {
        const initUser = await dispatch(getProfileUser());

        if (initUser.meta.requestStatus === 'fulfilled') {
          const userRole = (initUser.payload as IUser).roles;

          if (userRole.find(item => item.title === 'manager')) {
            router.push(APP_PATHS.REQUESTS_LIST);
          } else {
            router.push(APP_PATHS.ADMIN);
          }
        }
      }
    } catch (error: any) {
      console.error('Ошибка:', error);
    }
  };

  const handleTimerEnd = () => {
    setAuthAttempt(null);
    setIsGetCode(false);
  };

  return {
    nodeRef,
    form,
    phone,
    isGetCode,
    showCode,
    isDisabledFormSubmit,
    setIsDisabledFormSubmit,
    dispatch,
    setFpHash,
    router,
    authAttempt,
    initialSeconds,
    accessToken,
    authError,
    isPhoneComplete,
    changePhone,
    getAuthCode,
    onFinishSubmitAuth,
    handleTimerEnd,
    CHECKING_FIELDS_NAME,
    isErrorGetCode,
  };
};
