import styles from './relatedProduct.module.css';
import RelationIcon from '@/public/linkEditor.svg';
import EditIcon from '@/public/editIcon.svg';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import { Button, Form, Radio, Select } from 'antd';
import classNames from 'classnames';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { FC, useEffect, useState } from 'react';
import PlusIcon from '@/public/plus.svg';
import dynamic from 'next/dynamic';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { IProperties } from '@/interface/addingProduct/options.interface';
import { getPopupContainer } from '@/data/utils.common';

interface IProps {
  fieldName: number;
  relatedProduct: any;
  removeFieldName: (id: number) => void;
  isFully?: boolean;
  initialDescription?: string;
}

const Editor = dynamic(() => import('@/app/components/Editor/Editor'), {
  ssr: false,
});

export const RelatedProduct: FC<IProps> = ({
  fieldName,
  relatedProduct,
  removeFieldName,
  isFully,
  initialDescription,
}: IProps) => {
  const [relatedProductProperties, setRelatedProductProperties] = useState<
    IProperties[]
  >([]);
  const [isCompatibility, setIsCompatibility] = useState<boolean>(
    isFully || false,
  );

  useEffect(() => {
    if (relatedProduct) {
      const fetchProperties = async () => {
        const { data } = await APIRequest.get(
          API_ENDPOINTS.GET_PRODUCT_PROPERTIES(relatedProduct.id),
        );
        setRelatedProductProperties(data);
      };
      fetchProperties();
    }
  }, [relatedProduct]);

  const onChangeType = (value: string) => {
    setIsCompatibility(value === 'compatibility');
  };

  return (
    <div className={classNames(['neutral-container', styles.container])}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <div className={styles.title}>
            <RelationIcon />
            <span>Связанный товар</span>
          </div>
          <div>{relatedProduct?.name}</div>
        </div>
        <div className={styles.buttonWrapper}>
          <Button className={classNames(['button-transparent', styles.button])}>
            <EditIcon />
          </Button>
          <Button
            className={classNames(['button-transparent', styles.button])}
            onClick={() => removeFieldName(fieldName)}
          >
            <DeleteIcon />
          </Button>
        </div>
      </div>
      <div className={styles.formItem}>
        <Form.Item
          name={[fieldName, 'propertyValuesId']}
          label={<LabelTitle text="Характеристика / Значение" />}
          colon={false}
        >
          <Select
            getPopupContainer={getPopupContainer}
            className={styles.select}
            placeholder="Выберите из списка"
            options={relatedProductProperties
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
        <Form.List name={[fieldName, 'relatedPropertyValuesIds']}>
          {(fields, { add: addProperty, remove }) => (
            <>
              {fields.map((subField, key) => {
                const { key: subFieldKey, ...restSubField } = subField;
                return (
                  <div key={'key' + key} className={styles.gridContainer}>
                    <Form.Item
                      {...restSubField}
                      name={[subField.name, 'propertyValuesId']}
                      label={<LabelTitle text="Характеристика / Значение" />}
                      colon={false}
                    >
                      <Select
                        getPopupContainer={getPopupContainer}
                        className={styles.select}
                        placeholder="Выберите из списка"
                        options={relatedProductProperties
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
                      onClick={() => remove(subField.name)}
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                );
              })}
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
        <Form.Item
          name={[fieldName, 'type']}
          label={<LabelTitle text="Тип связи" />}
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
            onChange={onChangeType}
            className={styles.select}
            placeholder="Выберите из списка"
            options={[
              {
                value: 'inclusion',
                key: 'inclusion',
                label: 'Многосоставность',
              },
              {
                value: 'compatibility',
                key: 'compatibility',
                label: 'Совместимость',
              },
              { value: 'affection', key: 'affection', label: 'Зависимость' },
            ]}
          />
        </Form.Item>
        {isCompatibility && (
          <>
            <Form.Item
              label={
                <LabelTitle text="Оцените опыт экспплуатации товара от данного производителя от 1 до 5, где 1 – крайне негативный, 5 – крайне позитивный." />
              }
              name={[fieldName, 'isFully']}
              initialValue={'true'}
            >
              <Radio.Group>
                <Radio value="true">Полная</Radio>
                <Radio value="false">Частичная</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name={[fieldName, 'description']}
              label={<LabelTitle text="Описание" />}
            >
              <Editor
                placeholder="Введите описание товара"
                initialValue={initialDescription}
              />
            </Form.Item>
          </>
        )}
      </div>
    </div>
  );
};
