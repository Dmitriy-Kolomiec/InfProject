import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Form, Input, Button, FormInstance, Modal } from 'antd';
import styles from './addPartnumbers.module.css';
import PlusIcon from '@/public/plus.svg';
import classNames from 'classnames';
import { AddManufacturer } from './components/addManufacturer/AddManufacturer';
import PageContent from '@/app/components/PageContent/PageContent';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { useSearchParams } from 'next/navigation';
import { IPartNumbers } from '@/interface/addingProduct/partNumbers.interface';
import AddVehicles from '../../../TabOptions/Components/Vehicles/addVehicles/AddVehicles';
import { AddVehiclesDrawer } from './components/addVehicle/AddVehiclesDrawer';
import FileUpload from '@/app/components/FileUpload/FileUpload';

interface IProps {
  form: FormInstance<any>;
  onFinish: (value: any) => void;
  editPartNumber?: IPartNumbers[];
  setFileIdsDescription: Dispatch<SetStateAction<number[]>>;
}

export default function DrawerEditingPartnumbers({
  form,
  onFinish,
  editPartNumber,
  setFileIdsDescription,
}: IProps) {
  const [isOpenModalAddVehicle, setIsOpenModalAddVehicle] =
    useState<boolean>(false);
  const searchParams = useSearchParams();
  const partNumberEditId: string | null = searchParams.get('partNumberEdit');

  useEffect(() => {
    if (partNumberEditId) {
      const initialValues = {
        partNumber: editPartNumber
          ? editPartNumber[0]?.partNumber?.partNumber
          : '',
        autoModelsIds: editPartNumber
          ? editPartNumber[0]?.vehicle?.map(vehicle => ({
              vehicleId: vehicle.autoModel.id,
              amount: vehicle.autoModel.amount,
              identifyMethod: vehicle.autoModel.identifyMethod,
              externalScheme: vehicle.autoModel.externalScheme,
            }))
          : [],
        manufacturers: editPartNumber
          ? editPartNumber[0]?.manufacturer?.map(m => ({
              manufacturerId: m.manufacturer?.id,
              rating: m.experience.rating?.toString() || 'Не задан',
              review: m.experience.review,
            }))
          : [],
      };
      form.setFieldsValue(initialValues);
    }
  }, [partNumberEditId, form]);

  return (
    <>
      {partNumberEditId && (
        <Form
          className={classNames([styles.form, 'neutral-container'])}
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
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
                      key={key}
                      initialIdentifyMethod={
                        editPartNumber?.[0].vehicle[field.name]?.autoModel
                          .identifyMethod
                      }
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
                      initialDescription={
                        editPartNumber?.[0].manufacturer[field.name]?.experience
                          .review
                      }
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
              initialData={editPartNumber?.[0].files}
              urlPath="partNumber"
            />
          </PageContent>
        </Form>
      )}
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
    </>
  );
}
