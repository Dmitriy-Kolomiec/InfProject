import { useEffect } from 'react';
import { Button, Form, Select, Modal } from 'antd';
import PageContent from '@/app/components/PageContent/PageContent';
import { AddCharacteristicsProps } from './addCharacteristics.props';
import CloseIcon from '@/public/close.svg';
import classNames from 'classnames';
import styles from './addCharacteristics.module.css';
import PlusIcon from '@/public/plus.svg';
import { getPopupContainer, onFormFieldsChange } from '@/data/utils.common';
import AddValue from './components/Values/AddValue';
import CreateNewCharacteristic from './components/Modal/CreateNewCharacteristic';
import NotificationDanger from '@/app/components/Notification/Danger';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { useEditCharacteristic } from './useEditCharacteristic.hook';

// TODO сделать один компонент в drawer add characteristic for partnumber
export default function EditCharacteristics({}: AddCharacteristicsProps) {
  const {
    form,
    valueCount,
    setValueCount,
    activeTab,
    setFileIds,
    editPropertyProductId,
    setShouldShowComponent,
    dataProduct,
    editProperty,
    isDisabledFormSubmit,
    setIsDisabledFormSubmit,
    isOpenModalAddCharacteristics,
    setIsOpenModalAddCharacteristics,
    properties,
    fetchProperties,
    onFinish,
    clearQueryPropertyEdit,
    CHECKING_FIELDS_NAME,
    newEditProperty,
    setNewEditProperty,
  } = useEditCharacteristic();

  useEffect(() => {
    fetchProperties();
    form.setFieldsValue({
      propertyId: newEditProperty,
    });
  }, [newEditProperty]);

  useEffect(() => {
    if (editPropertyProductId && dataProduct.properties) {
      const initialProperty = dataProduct.properties.find(
        item => item.propertyProductId === Number(editPropertyProductId),
      );
      form.setFieldsValue({
        propertyId: initialProperty?.property.id || undefined,
        propertyValues:
          initialProperty?.propertyValues?.map(value => ({
            propertyValuesId: value.id,
            value: value.value,
            description: value.description,
          })) || undefined,
      });
    }
  }, [editPropertyProductId, form, dataProduct.properties]);

  const hidenEditProperties = () => {
    setShouldShowComponent(state => ({
      ...state,
      showEditProperties: false,
    }));
    clearQueryPropertyEdit();

    form.resetFields();
  };

  return (
    <>
      {editProperty && editProperty.length > 0 && (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className={styles.form}
          onFieldsChange={changedFields =>
            onFormFieldsChange(
              form,
              setIsDisabledFormSubmit,
              CHECKING_FIELDS_NAME,
              changedFields,
            )
          }
        >
          <PageContent
            className={classNames([
              styles.container,
              {
                [styles.drawer]: activeTab === 'partnumbers',
              },
            ])}
          >
            <div>
              <div>
                <Button
                  className={classNames([
                    styles.closeIcon,
                    'button-transparent',
                  ])}
                  onClick={hidenEditProperties}
                >
                  <CloseIcon />
                </Button>
              </div>

              <Form.Item
                name="propertyId"
                label={
                  <LabelTitle
                    text="Характеристика"
                    className={styles.labelTitle}
                  />
                }
                colon={false}
                rules={[
                  {
                    required: true,
                    message: 'Обязательно для заполнения',
                  },
                ]}
              >
                <Select
                  getPopupContainer={getPopupContainer}
                  className={styles.select}
                  placeholder="Выберите из списка"
                  dropdownRender={menu => (
                    <>
                      {!!properties.length ? (
                        <>
                          <Button
                            className={classNames([
                              styles.itemSelect,
                              'button-transparent',
                            ])}
                            onClick={e => {
                              e.preventDefault();
                              setIsOpenModalAddCharacteristics(true);
                            }}
                          >
                            <PlusIcon />
                            <span>Добавить новый вариант</span>
                          </Button>
                          {menu}
                        </>
                      ) : (
                        <Button
                          className={classNames([
                            styles.itemSelect,
                            'button-transparent',
                          ])}
                          onClick={e => {
                            e.preventDefault();
                            setIsOpenModalAddCharacteristics(true);
                          }}
                        >
                          <PlusIcon />
                          <span>Добавить новый вариант</span>
                        </Button>
                      )}
                    </>
                  )}
                  options={properties.map(item => ({
                    key: item.id,
                    value: item.id,
                    label: (
                      <>
                        {item.property}
                        {item.unit && `, ${item.unit}`}
                      </>
                    ),
                  }))}
                />
              </Form.Item>
              <div className={styles.addValue}>
                {!!valueCount && (
                  <div className={styles.valueTitle}>
                    <span>Значения</span>
                    <span className={styles.valueCount}>({valueCount})</span>
                  </div>
                )}
                <Form.List name="propertyValues">
                  {(fields, { add, remove }) => {
                    // TODO Ругается сюда, надо поправить
                    if (fields.length >= 1) {
                      setValueCount(fields.length);
                    } else {
                      setValueCount(0);
                    }
                    return (
                      <div>
                        {fields.map((field, key) => (
                          <AddValue
                            setFileIds={setFileIds}
                            initialDescription={
                              editProperty?.[0].propertyValues?.[key]
                                ?.description ?? ''
                            }
                            fieldKey={field.name}
                            key={key}
                            removeValue={remove}
                            initialFiles={
                              editProperty?.[0].propertyValues?.[key]?.files
                            }
                          />
                        ))}
                        <div
                          className={classNames([
                            styles.addValueButton,
                            'neutral-container',
                          ])}
                        >
                          <Button
                            className="button-white"
                            onClick={() => add()}
                          >
                            <PlusIcon />
                            Добавить значение
                          </Button>
                        </div>
                      </div>
                    );
                  }}
                </Form.List>
              </div>
              {isDisabledFormSubmit && (
                <NotificationDanger
                  text="Не заполнены обязательные поля."
                  className={styles.notification}
                />
              )}
            </div>
            {activeTab !== 'partnumbers' && (
              <div className={styles.buttonWrapper}>
                <Button
                  className={classNames(['button-transparent'])}
                  onClick={hidenEditProperties}
                >
                  Отмена
                </Button>
                <Button
                  disabled={isDisabledFormSubmit}
                  className={'button-primary'}
                  htmlType="submit"
                >
                  Сохранить
                </Button>
              </div>
            )}

            {activeTab === 'partnumbers' && (
              <Button
                className={classNames(['button-primary', styles.saveButton])}
                htmlType="submit"
              >
                Сохранить
              </Button>
            )}
          </PageContent>
          <Modal
            open={isOpenModalAddCharacteristics}
            onCancel={() => setIsOpenModalAddCharacteristics(false)}
            centered
            className={styles.modalDelete}
            title="Добавление новой характеристики"
            footer={null}
            width={600}
          >
            <CreateNewCharacteristic
              hideModal={setIsOpenModalAddCharacteristics}
              setNewProperty={setNewEditProperty}
            />
          </Modal>
        </Form>
      )}
    </>
  );
}
