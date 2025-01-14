'use client';
import styles from './auth.module.css';
import { Title } from '@/app/components/Title/Title';
import PageContent from '@/app/components/PageContent/PageContent';
import InputMask from 'react-input-mask';
import { useEffect } from 'react';
import React from 'react';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { Button, Form, Input } from 'antd';
import classNames from 'classnames';
import { onFormFieldsChange } from '@/data/utils.common';
import { authActions } from '@/store/slice/authSlice';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { APP_PATHS } from '@/data/paths.data';
import Timer from '@/app/components/Timer/Timer';
import { useAuthorization } from './useAuthorization.hook';

export default function AuthorizationPageContent(): React.ReactElement {
  const {
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
  } = useAuthorization();
  useEffect(() => {
    const setFp = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      setFpHash(visitorId);
      dispatch(authActions.setFP(visitorId));
    };
    setFp();
  }, []);

  useEffect(() => {
    if (accessToken) {
      router.push(APP_PATHS.HOME);
    }
  }, [accessToken, router]);

  return (
    <div className={styles.container}>
      <PageContent>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinishSubmitAuth}
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
        >
          <div className={styles.flexContainer}>
            <Title tag="h3">Вход в аккаунт</Title>
            <span>
              Укажите номер телефона. На него будет отправлен код для входа в
              аккаунт.
            </span>
          </div>
          <div>
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
              {isErrorGetCode && (
                <span className="error">Номер телефона не найден</span>
              )}
            </div>
          </div>
          <div className={styles.flexContainer}>
            <Button
              className={classNames([styles.button, 'button-primary'])}
              disabled={!!authAttempt || !isPhoneComplete(phone)}
              onClick={() => getAuthCode(phone)}
            >
              {isGetCode ? 'Код запрошен' : 'Запросить код'}
            </Button>
            {!!authAttempt && (
              <div className={styles.reqNewCode}>
                Новый код можно запросить через{' '}
                <Timer
                  initialSeconds={initialSeconds}
                  onTimerEnd={handleTimerEnd}
                />
              </div>
            )}
          </div>
          {showCode && (
            <>
              <div className={styles.code}>
                <Form.Item name="code" label={<LabelTitle text="Код" />}>
                  <Input placeholder="Введите код из смс" maxLength={4} />
                </Form.Item>
                {authError && (
                  <span className="error">Указан неверный код.</span>
                )}
              </div>
              <Button
                disabled={isDisabledFormSubmit}
                className={classNames([styles.button, 'button-primary'])}
                htmlType="submit"
              >
                Войти
              </Button>
            </>
          )}
        </Form>
      </PageContent>
    </div>
  );
}
