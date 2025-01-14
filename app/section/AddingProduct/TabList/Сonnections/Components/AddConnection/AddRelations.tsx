import { Title } from '@/app/components/Title/Title';
import styles from './addRelations.module.css';
import { Button, Form, Modal, Select } from 'antd';
import classNames from 'classnames';
import PageContent from '@/app/components/PageContent/PageContent';
import PlusIcon from '@/public/plus.svg';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import NotificationDanger from '@/app/components/Notification/Danger';
import AddingRelatedProduct from '../Modal/AddingRelaterProduct/AddingRelatedProduct';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import CloseIcon from '@/public/close.svg';
import { RelatedProduct } from './components/relatedProduct/RelatedProduct';
import { useAddRalation } from './useAddRelations.hook';
import { getPopupContainer } from '@/data/utils.common';

export default function AddRelations() {
  const {
    isOpenModalAddRelatedProduct,
    setIsOpenModalAddRelatedProduct,
    form,
    dataProduct,
    relatedProduct,
    setRelatedProduct,
    isDisabled,
    setIsDisabled,
    valueCount,
    setValueCount,
    onFormFieldsChangeForPartnumbers,
    onFinish,
    hideAddingRelations,
    CHECKING_FIELDS_NAME,
  } = useAddRalation();

  return (
    <PageContent className={styles.container}>
      <Button
        className={classNames([styles.closeIcon, 'button-transparent'])}
        onClick={hideAddingRelations}
      >
        <CloseIcon />
      </Button>
      <Title tag="h3">Создание связи</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className={styles.form}
        onFieldsChange={changedFields =>
          onFormFieldsChangeForPartnumbers(
            form,
            setIsDisabled,
            CHECKING_FIELDS_NAME,
            changedFields,
          )
        }
      >
        <div className={classNames(['neutral-container', styles.content])}>
          <div className={styles.title}>
            <LabelTitle text="Текущий товар" />
            <div>{dataProduct.product.name}</div>
          </div>
          <Form.Item
            name="propertyValuesId"
            label={<LabelTitle text="Характеристика / Значение" />}
            colon={false}
          >
            <Select
              getPopupContainer={getPopupContainer}
              className={styles.select}
              placeholder="Выберите из списка"
              options={dataProduct.properties
                ?.map(property =>
                  property.propertyValues.map(value => ({
                    key: value.id,
                    label: (
                      <div>
                        <span className={styles.titleSelect}>
                          {property.property.name}
                          {!!property.unit?.name && `/${property.unit.name}`}
                        </span>
                        <span>
                          {' , '}
                          {value.value}
                        </span>
                      </div>
                    ),
                    value: value.id,
                  })),
                )
                .flat()}
            />
          </Form.Item>
          <Form.List name="additionalPropertyValuesId">
            {(fields, { add: addProperty, remove }) => (
              <>
                {fields.map((field, key) => (
                  <div key={key} className={styles.gridContainer}>
                    <Form.Item
                      name={[field.name, 'propertyValuesId']}
                      label={<LabelTitle text="Характеристика / Значение" />}
                      colon={false}
                    >
                      <Select
                        getPopupContainer={getPopupContainer}
                        className={styles.select}
                        placeholder="Выберите из списка"
                        options={dataProduct.properties
                          ?.map(property =>
                            property.propertyValues.map(value => ({
                              key: value.id,
                              label: (
                                <div>
                                  <span className={styles.titleSelect}>
                                    {property.property.name}
                                    {!!property.unit?.name &&
                                      `/${property.unit.name}`}
                                  </span>
                                  <span>
                                    {' , '}
                                    {value.value}
                                  </span>
                                </div>
                              ),
                              value: value.id,
                            })),
                          )
                          .flat()}
                      />
                    </Form.Item>
                    <Button
                      className={classNames([
                        styles.buttonDelete,
                        'button-transparent',
                      ])}
                      onClick={() => remove(field.name)}
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                ))}
                <Button
                  className={classNames([
                    'button-transparent',
                    styles.addCharacteristicButton,
                  ])}
                  onClick={() => addProperty()}
                >
                  <PlusIcon />
                  Добавить характеристику
                </Button>
              </>
            )}
          </Form.List>
        </div>
        {!!valueCount && (
          <div className={styles.valueRelations}>
            <span>Связанные товары</span>
            <span className={styles.valueCount}>({valueCount})</span>
          </div>
        )}
        <Form.List name="relatedPropertyValues">
          {(fields, { add, remove }) => {
            // TODO Ругается сюда, надо поправить
            if (fields.length >= 1) {
              setValueCount(fields.length);
            } else {
              setValueCount(0);
            }
            const removeFieldName = (fieldName: number) => {
              setRelatedProduct(
                state => state?.filter((_, index) => index !== fieldName),
              );
              remove(fieldName);
            };

            return (
              <div>
                {fields.map((field, key) => (
                  <RelatedProduct
                    fieldName={field.name}
                    relatedProduct={relatedProduct?.[field.name]!}
                    key={key}
                    removeFieldName={removeFieldName}
                  />
                ))}
                <Modal
                  open={isOpenModalAddRelatedProduct}
                  onCancel={() => setIsOpenModalAddRelatedProduct(false)}
                  centered
                  footer={null}
                  width={`75%`}
                  className="adding-related"
                >
                  <AddingRelatedProduct
                    addRelation={add}
                    hideModal={setIsOpenModalAddRelatedProduct}
                    setRelatedProduct={setRelatedProduct}
                    relatedProduct={relatedProduct}
                  />
                </Modal>
              </div>
            );
          }}
        </Form.List>
        <div
          className={classNames([
            'neutral-container',
            styles.addingRelatedProduct,
          ])}
        >
          <Button
            className={classNames(['button-white', styles.addRelationsButton])}
            onClick={() => setIsOpenModalAddRelatedProduct(true)}
          >
            <PlusIcon />
            Добавить связанный товар
          </Button>
        </div>
        {!relatedProduct?.length && (
          <NotificationDanger
            text="Не добавлен ни один связанный товар."
            className={styles.notification}
          />
        )}
        <div className={styles.buttonWrapper}>
          <Button
            onClick={hideAddingRelations}
            className={classNames(['button-transparent'])}
          >
            Отмена
          </Button>
          <Button
            className={classNames(['button-primary', styles.button])}
            htmlType="submit"
            disabled={isDisabled}
          >
            Сохранить
          </Button>
        </div>
      </Form>
    </PageContent>
  );
}
