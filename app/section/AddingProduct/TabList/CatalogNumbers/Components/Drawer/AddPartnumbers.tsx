import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Form, Input, Button, Modal, FormInstance } from 'antd';
import styles from './addPartnumbers.module.css';
import PlusIcon from '@/public/plus.svg';
import classNames from 'classnames';
import { AddManufacturer } from './components/addManufacturer/AddManufacturer';
import PageContent from '@/app/components/PageContent/PageContent';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import AddVehicles from '../../../TabOptions/Components/Vehicles/addVehicles/AddVehicles';
import { AddVehiclesDrawer } from './components/addVehicle/AddVehiclesDrawer';
import { IDataProduct } from '@/interface/addingProduct/product.interface';
import FileUpload from '@/app/components/FileUpload/FileUpload';

interface IProps {
  form: FormInstance<any>;
  onFinish: (value: any) => void;
  setIsDisabled: Dispatch<SetStateAction<boolean>>;
  setFileIdsDescription: Dispatch<SetStateAction<number[]>>;
}

// Это функция киборг, для валидации такой формы с диначическими Form.Item только для AddPartNumber.
const onFormFieldsChangeForPartnumbers = (
  form: FormInstance<IDataProduct>,
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  checkingFieldsName: string[],
  changedFields?: any[],
) => {
  // Проверяем, есть ли среди измененных полей обязательные
  const isRelevantChange = changedFields?.some(field =>
    checkingFieldsName.includes(field.name[0]),
  );

  if (!isRelevantChange) {
    return; // Если изменений в обязательных полях нет, выходим
  }
  // Получаем значения всех обязательных полей из формы
  const fieldsValue = form.getFieldsValue(checkingFieldsName);
  // Проверяем, заполнены ли все обязательные поля
  const isRequiredFieldsFilled = Object.entries(fieldsValue).every(
    ([key, value]) => {
      if (Array.isArray(value)) {
        return value.every(model => {
          if (key === 'autoModelsIds') {
            return model && model.vehicleId && model.vehicleId !== '';
          }
          if (key === 'manufacturers') {
            return model && model.manufacturerId && model.manufacturerId !== '';
          }
          return false;
        });
      }
      return value !== undefined && value !== null && value !== '';
    },
  );
  // Проверяем, есть ли ошибки в форме
  const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

  // Если все поля заполнены и нет ошибок, кнопка разблокирована
  const disabled = !isRequiredFieldsFilled || hasErrors;
  setIsDisabled(disabled);
};

const CHECKING_FIELDS_NAME = ['partNumber', 'manufacturers'];

export default function DrawerAddingPartnumbers({
  form,
  onFinish,
  setIsDisabled,
  setFileIdsDescription,
}: IProps) {
  const [isOpenModalAddVehicle, setIsOpenModalAddVehicle] =
    useState<boolean>(false);

  return (
    <Form
      className={classNames([styles.form, 'neutral-container'])}
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      onFieldsChange={changedFields =>
        onFormFieldsChangeForPartnumbers(
          form,
          setIsDisabled,
          CHECKING_FIELDS_NAME,
          changedFields,
        )
      }
    >
      <Form.Item
        name="partNumber"
        label={<LabelTitle text="Каталожный номер" />}
      >
        <Input placeholder="Введите значение" />
      </Form.Item>
      <Form.List name="autoModelsIds">
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map((field, key) => (
                <AddVehiclesDrawer
                  isOpenModalAddVehicle={setIsOpenModalAddVehicle}
                  remove={remove}
                  fieldName={field.name}
                  key={`${key}_field.key`}
                />
              ))}
              <PageContent isCenter>
                <Button
                  className={classNames([
                    'button-white',
                    styles.addManufacturerButton,
                  ])}
                  onClick={() => add()}
                >
                  <PlusIcon />
                  Добавить Транспортное средство
                </Button>
              </PageContent>
            </>
          );
        }}
      </Form.List>
      <Form.List name="manufacturers">
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map((field, key) => (
                <AddManufacturer
                  form={form}
                  key={key}
                  remove={remove}
                  fieldName={field.name}
                />
              ))}
              <PageContent isCenter>
                <Button
                  className={classNames([
                    'button-white',
                    styles.addManufacturerButton,
                  ])}
                  onClick={() => add()}
                >
                  <PlusIcon />
                  Добавить производителя
                </Button>
              </PageContent>
            </>
          );
        }}
      </Form.List>

      <PageContent>
        <FileUpload
          setFileIdsDescription={setFileIdsDescription}
          urlPath="partNumber"
        />
      </PageContent>
      <Modal
        open={isOpenModalAddVehicle}
        onCancel={() => setIsOpenModalAddVehicle(false)}
        centered
        footer={null}
        width={676}
        zIndex={2000}
      >
        <AddVehicles hideModal={setIsOpenModalAddVehicle} />
      </Modal>
    </Form>
  );
}
