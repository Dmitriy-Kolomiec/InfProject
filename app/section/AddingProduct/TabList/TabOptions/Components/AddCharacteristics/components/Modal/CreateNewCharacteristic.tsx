import { Button, Form, Input, Select } from 'antd';
import styles from './createNewCharacteristic.module.css';
import {
  getPopupContainer,
  notify,
  onFormFieldsChange,
} from '@/data/utils.common';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import classNames from 'classnames';
import PlusIcon from '@/public/plus.svg';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { IUnit } from '@/interface/addingProduct/options.interface';
import axios from 'axios';

const CHECKING_FIELDS_NAME = ['property'];

interface IProps {
  hideModal: Dispatch<SetStateAction<boolean>>;
  setNewProperty?: Dispatch<SetStateAction<number | undefined>>;
}

interface IFormValues {
  property: string;
  unit?: string;
  manualUnitId?: string;
}

export default function CreateNewCharacteristic({
  hideModal,
  setNewProperty,
}: IProps) {
  const [form] = Form.useForm();
  const [isDisabledFormSubmit, setIsDisabledFormSubmit] =
    useState<boolean>(true);
  const [addFieldManually, setAddFieldManually] = useState<boolean>(false);
  const [units, setUnits] = useState<IUnit[]>([]);
  const [isLoader, setIsLoader] = useState<boolean>(false);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const res = await APIRequest.get<IUnit[]>(API_ENDPOINTS.GET_UNIT);
        setUnits(res.data);
      } catch (error) {
        console.error('Ошибка при получении единиц измерения:', error);
      }
    };
    fetchUnit();
  }, []);

  const onFinish = async (value: IFormValues) => {
    setIsLoader(true);
    try {
      const { data } = await APIRequest.post<any>(API_ENDPOINTS.ADD_PROPERTY, {
        property: value.property,
        unit: value.unit || value.manualUnitId,
      });
      if (data) {
        setNewProperty?.(data.property.id);
        setIsLoader(false);
        form.resetFields();
        hideModal(false);
      }
    } catch (error) {
      console.error('Ошибка при создании новой характеристики:', error);
      if (axios.isAxiosError(error) && error.message) {
        setIsLoader(false);
        hideModal(false);
        notify('error', {
          message: error.message,
        });
      }
    }
  };
  const handleFieldManually = () => {
    form.resetFields(['unit']);
    setAddFieldManually(true);
  };

  const closeModalCreateCharacteristic = () => {
    form.resetFields();
    hideModal(false);
  };
  return (
    <Form
      className={styles.form}
      form={form}
      layout="vertical"
      requiredMark={false}
      onFinish={onFinish}
      onFieldsChange={changedFields => {
        onFormFieldsChange(
          form,
          setIsDisabledFormSubmit,
          CHECKING_FIELDS_NAME,
          changedFields,
        );
      }}
    >
      <div>
        <Form.Item label={<LabelTitle text="Название" />} name="property">
          <Input
            className={styles.input}
            placeholder="Введите название характеристики"
          />
        </Form.Item>
        <Form.Item
          name="unit"
          label={<LabelTitle text="Единица измерения" />}
          className={styles.formItem}
        >
          <Select
            getPopupContainer={getPopupContainer}
            disabled={addFieldManually}
            className={styles.select}
            placeholder="Выберите из списка"
            options={units.map(item => ({
              key: item.id,
              value: item.name,
              label: item.name,
            }))}
          />
        </Form.Item>
        {addFieldManually ? (
          <div className={styles.manualUnit}>
            <Form.Item name="manualUnitId" className={styles.formItem}>
              <Input
                className={styles.inputUnit}
                placeholder="Введите единицу измерения"
              />
            </Form.Item>
            <Button
              className={styles.manualUnitButton}
              onClick={() => setAddFieldManually(false)}
            >
              <DeleteIcon />
            </Button>
          </div>
        ) : (
          <Button
            className={classNames(['button-transparent', styles.addButton])}
            onClick={handleFieldManually}
          >
            <PlusIcon />
            Добавить вручную
          </Button>
        )}
      </div>
      <div className={styles.buttonWrapper}>
        <Button
          className={classNames(['button-transparent'])}
          onClick={closeModalCreateCharacteristic}
        >
          Отмена
        </Button>
        <Button
          htmlType="submit"
          className={classNames([styles.button, 'button-primary'])}
          disabled={isDisabledFormSubmit}
          loading={isLoader}
        >
          Сохранить
        </Button>
      </div>
    </Form>
  );
}
