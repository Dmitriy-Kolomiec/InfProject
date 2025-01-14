import { useEffect } from 'react';
import { Button, Form, Select, Modal } from 'antd';
import PageContent from '@/app/components/PageContent/PageContent';
import { AddCharacteristicsProps } from './addCharacteristics.props';
import { Title } from '@/app/components/Title/Title';
import CloseIcon from '@/public/close.svg';
import classNames from 'classnames';
import styles from './addCharacteristics.module.css';
import PlusIcon from '@/public/plus.svg';
import { getPopupContainer, onFormFieldsChange } from '@/data/utils.common';
import AddValue from './components/Values/AddValue';
import CreateNewCharacteristic from './components/Modal/CreateNewCharacteristic';
import NotificationDanger from '@/app/components/Notification/Danger';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { useAddCharacteristic } from './useAddCharacteristic.hook';

const CHECKING_FIELDS_NAME = ['propertyId'];

// TODO сделать один компонент в drawer add characteristic for partnumber
export default function AddCharacteristics({
  closeDrawer,
}: AddCharacteristicsProps) {
  const {
    form,
    valueCount,
    setValueCount,
    activeTab,
    isDisabledFormSubmit,
    setIsDisabledFormSubmit,
    isOpenModalAddCharacteristics,
    setIsOpenModalAddCharacteristics,
    propirties,
    fetchProperties,
    handleSubmitAddCharacteristic,
    hidenAddingCategory,
    setFileIds,
    newProperty,
    setNewProperty,
    isLoader,
  } = useAddCharacteristic({ closeDrawer });

  useEffect(() => {
    fetchProperties();
    form.setFieldsValue({
      propertyId: newProperty,
    });
  }, [newProperty]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmitAddCharacteristic}
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
              className={classNames([styles.closeIcon, 'button-transparent'])}
              onClick={closeDrawer || hidenAddingCategory}
            >
              <CloseIcon />
            </Button>
            <Title tag="h3">Добавление характеристики</Title>
          </div>

          <Form.Item
            name="propertyId"
            label={
              <LabelTitle text="Характеристика" className={styles.labelTitle} />
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
                  {!!propirties.length ? (
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
              options={propirties.map(item => ({
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
                        fieldKey={field.key}
                        key={key}
                        removeValue={remove}
                        setFileIds={setFileIds}
                      />
                    ))}
                    <div
                      className={classNames([
                        styles.addValueButton,
                        'neutral-container',
                      ])}
                    >
                      <Button className="button-white" onClick={() => add()}>
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
              onClick={hidenAddingCategory}
            >
              Отмена
            </Button>
            <Button
              disabled={isDisabledFormSubmit}
              className={'button-primary'}
              htmlType="submit"
              loading={isLoader}
            >
              Сохранить
            </Button>
          </div>
        )}

        {activeTab === 'partnumbers' && (
          <Button
            className={classNames(['button-primary', styles.saveButton])}
            htmlType="submit"
            loading={isLoader}
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
          setNewProperty={setNewProperty}
        />
      </Modal>
    </Form>
  );
}
