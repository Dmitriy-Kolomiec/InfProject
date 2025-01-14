import { Title } from '@/app/components/Title/Title';
import styles from '../AddConnection/addRelations.module.css';
import { Button, Form, Modal, Select } from 'antd';
import { useEffect } from 'react';
import classNames from 'classnames';
import PageContent from '@/app/components/PageContent/PageContent';
import PlusIcon from '@/public/plus.svg';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import AddingRelatedProduct from '../Modal/AddingRelaterProduct/AddingRelatedProduct';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import CloseIcon from '@/public/close.svg';
import { RelatedProduct } from '../AddConnection/components/relatedProduct/RelatedProduct';
import { useEditRelations } from './useEditRelations.hook';
import { getPopupContainer } from '@/data/utils.common';

export default function EditRelations() {
  const {
    isOpenModalAddRelatedProduct,
    setIsOpenModalAddRelatedProduct,
    form,
    dataProduct,
    relationEdit,
    editPropertyValueIds,
    editRelation,
    setEditRelation,
    relatedProduct,
    setRelatedProduct,
    initialRelatedProduct,
    onFinish,
    hideEditingRelations,
  } = useEditRelations();

  useEffect(() => {
    if (editPropertyValueIds && dataProduct.connections) {
      const foundRelation = dataProduct.connections.find(connection =>
        connection.propertyValue.every(prop =>
          editPropertyValueIds.includes(prop.propertyValueId),
        ),
      );
      setEditRelation(foundRelation || null);
    }
  }, [editPropertyValueIds, dataProduct.connections, relationEdit]);

  useEffect(() => {
    if (editRelation) {
      setRelatedProduct(
        editRelation.relatedPropertyValues.map(p => p.relatedProduct),
      );
      const initialValues = {
        propertyValuesId: editRelation.propertyValue[0]?.propertyValueId,
        additionalPropertyValuesId: editRelation.propertyValue
          .slice(1)
          .map(prop => ({ propertyValuesId: prop.propertyValueId })),
        relatedPropertyValues: editRelation.relatedPropertyValues.map(
          related => ({
            propertyValuesId: related.propertyValue[0]?.propertyValueId,
            relatedPropertyValuesIds: related.propertyValue
              .slice(1)
              .map(prop => ({ propertyValuesId: prop.propertyValueId })),
            type: related.relation.relationType,
            isFully: related.relation.isFully ? 'true' : 'false',
            description: related.relation.description,
          }),
        ),
      };
      form.setFieldsValue(initialValues);
    }
  }, [editRelation, form]);

  return (
    <PageContent className={styles.container}>
      <Button
        className={classNames([styles.closeIcon, 'button-transparent'])}
        onClick={hideEditingRelations}
      >
        <CloseIcon />
      </Button>
      <Title tag="h3">Редактирование связи</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className={styles.form}
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
        <Form.List name="relatedPropertyValues">
          {(fields, { add, remove }) => {
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
                    removeFieldName={removeFieldName}
                    fieldName={field.name}
                    relatedProduct={relatedProduct?.[field.name]}
                    key={key}
                    isFully={
                      initialRelatedProduct?.[field.name]?.relation.isFully
                    }
                    initialDescription={
                      initialRelatedProduct?.[field.name]?.relation.description
                    }
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
                    relatedProduct={relatedProduct}
                    addRelation={add}
                    hideModal={setIsOpenModalAddRelatedProduct}
                    setRelatedProduct={setRelatedProduct}
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
        <div className={styles.buttonWrapper}>
          <Button
            onClick={hideEditingRelations}
            className={classNames(['button-transparent'])}
          >
            Отмена
          </Button>
          <Button
            className={classNames(['button-primary', styles.button])}
            htmlType="submit"
          >
            Сохранить
          </Button>
        </div>
      </Form>
    </PageContent>
  );
}
