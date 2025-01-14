import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { API_ENDPOINTS } from '@/data/api/api.data';
import APIRequest from '@/data/api/api.utils';
import { notify } from '@/data/utils.common';
import {
  IDataProduct,
  IProduct,
} from '@/interface/addingProduct/product.interface';
import { Form, FormInstance } from 'antd';
import axios from 'axios';
import { useContext, useState } from 'react';

interface AdditionalPropertyValue {
  propertyValuesId: number;
}

interface RelatedPropertyValue {
  propertyValuesId: number;
  relatedPropertyValuesIds?: AdditionalPropertyValue[];
  type: string;
  isFully?: string;
  description?: string;
}

interface Values {
  propertyValuesId: number;
  additionalPropertyValuesId?: AdditionalPropertyValue[];
  relatedPropertyValues: RelatedPropertyValue[];
}

export const useAddRalation = () => {
  const CHECKING_FIELDS_NAME = ['propertyValuesId', 'relatedPropertyValues'];
  const [isOpenModalAddRelatedProduct, setIsOpenModalAddRelatedProduct] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const { dataProduct, setShouldShowComponent, setDataProduct } =
    useContext(ProductContext);
  const [relatedProduct, setRelatedProduct] = useState<IProduct[]>();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [valueCount, setValueCount] = useState<number>(0);

  const onFormFieldsChangeForPartnumbers = (
    form: FormInstance<IDataProduct>,
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
    checkingFieldsName: string[],
    changedFields?: any[],
  ) => {
    // Проверяем, есть ли среди измененных полей обязательные или проверяемые поля
    const isRelevantChange = changedFields?.some(field =>
      checkingFieldsName.includes(field.name[0]),
    );

    if (!isRelevantChange) {
      return; // Если изменений в обязательных или проверяемых полях нет, выходим
    }

    // Получаем значения всех обязательных и проверяемых полей из формы
    const fieldsValue = form.getFieldsValue(checkingFieldsName);

    // Проверяем, заполнены ли все обязательные поля и правильно ли выбран тип связи
    const isRequiredFieldsFilled = checkingFieldsName.every(fieldName => {
      const value = fieldsValue[fieldName];
      if (Array.isArray(value)) {
        return value.every(item => !!item); // Проверяем, что все элементы массива не пустые
      } else {
        return value !== undefined && value !== null && value !== '';
      }
    });

    // Проверяем, выбран ли тип связи для каждого элемента в relatedPropertyValues
    const isTypeSelected = fieldsValue.relatedPropertyValues?.every(
      (value: RelatedPropertyValue) => {
        return (
          value?.type !== undefined && value.type !== null && value.type !== ''
        );
      },
    );

    // Проверяем, есть ли ошибки в форме
    const hasErrors = form
      .getFieldsError()
      .some(({ errors }) => errors.length > 0);

    // Если все поля заполнены и нет ошибок, кнопка разблокирована
    const disabled = !isRequiredFieldsFilled || !isTypeSelected || hasErrors;
    setIsDisabled(disabled);
  };

  const onFinish = async (values: Values) => {
    if (!relatedProduct?.length) {
      return notify('error', {
        message: 'Добавьте связанный продукт',
      });
    }
    const mainPropertyValuesId = values.propertyValuesId;
    const additionalPropertyValuesIds = values.additionalPropertyValuesId
      ? values.additionalPropertyValuesId.map(item => item.propertyValuesId)
      : [];

    const propertyValuesIds = [
      mainPropertyValuesId,
      ...additionalPropertyValuesIds,
    ];

    const relatedPropertyValues = values.relatedPropertyValues.map(
      relatedValue => {
        const additionalRelatedValues = relatedValue.relatedPropertyValuesIds
          ? relatedValue.relatedPropertyValuesIds.map(
              item => item.propertyValuesId,
            )
          : [];

        const propertyValuesIds = [
          relatedValue.propertyValuesId,
          ...additionalRelatedValues,
        ];
        const result = {
          propertyValuesIds,
          type: relatedValue.type,
          description: relatedValue.description || '',
          isFully: false,
        };

        if (relatedValue.type === 'compatibility') {
          result.isFully = relatedValue.isFully === 'true';
        }

        return result;
      },
    );

    const requestBody = {
      propertyValuesIds,
      relatedPropertyValues,
    };
    try {
      const { data } = await APIRequest.post(
        API_ENDPOINTS.ADD_PRODUCT_CONNECTION,
        requestBody,
      );
      setDataProduct(state => ({
        ...state,
        connections: data.connections,
      }));
      hideAddingRelations();
    } catch (error) {
      console.error('Ошибка при создании каталожного номера:', error);
      if (axios.isAxiosError(error) && error.message) {
        notify('error', {
          message: error.message,
        });
      }
    }
  };

  const hideAddingRelations = () => {
    setShouldShowComponent(state => ({
      ...state,
      showAddingRelations: false,
    }));
    form.resetFields();
  };

  // TODO наброски на удаление уже выбранных select

  // const [selectedValues, setSelectedValues] = useState<number[]>([]);

  // const renderOptions = (dataProduct: IDataProduct) => {
  //   return dataProduct.properties?.flatMap(property => {
  //     const filteredOptions = property.propertyValues
  //       .map(value => ({
  //         label: value.value,
  //         value: value.id,
  //       }))
  //       .filter(option => !selectedValues.includes(option.value));

  //     if (filteredOptions.length === 0) {
  //       return [];
  //     }

  //     return {
  //       label: (
  //         <span key={property.propertyProductId} className={styles.titleSelect}>
  //           <>
  //             {property.property.name} {property.unit && `/ ${property.unit.name}`}
  //           </>
  //         </span>
  //       ),
  //       options: filteredOptions,
  //     };
  //   });
  // };

  // const handleSelectChange = () => {
  //   const updatedSelectedValues = form.getFieldsValue(true);
  //   const newSelectedValues = [
  //     updatedSelectedValues.characteristicName,
  //     ...(updatedSelectedValues.additionalCharacteristic || []).map(
  //       (item: any) => item.nameСharacteristic
  //     )
  //   ].filter(Boolean);

  //   setSelectedValues(newSelectedValues);
  // };
  // TODO

  return {
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
  };
};
