import { Button, Form, Select } from 'antd';
import styles from './listFormItem.module.css';
import PlusIcon from '@/public/plus.svg';
import { ListFormItemProps } from './listFormItem.props';
import classNames from 'classnames';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { useEffect } from 'react';
import { getPopupContainer } from '@/data/utils.common';

export default function ListFormItem({
  form,
  categories,
  setLastCategoryId,
  handleSubCategoryChange,
  handleCategoryChange,
  openModalCreateCategory,
  openModalCreateSubCategory,
  categoriesDic,
  selectedOptions,
  setSelectedOptions,
  newSubCategory,
  setCategory,
}: ListFormItemProps) {
  const handleCategorySelect = (category: string) => {
    setSelectedOptions([category]);
    handleCategoryChange(category);
  };

  const handleSubCategorySelect = (index: number) => (subCategory: string) => {
    setLastCategoryId(subCategory);

    setSelectedOptions(prevOptions => {
      // +1 потому что в этом массиве хранится ещё категория
      const subCategoryIndex = index + 1;
      const options = prevOptions.slice(0, subCategoryIndex);
      options[subCategoryIndex] = subCategory;
      return options;
    });
    handleSubCategoryChange?.(subCategory);
  };

  useEffect(() => {
    if (newSubCategory) {
      const fields = form.getFieldsValue(true);
      // -1 потому что в этом массиве хранится ещё root category
      const index = Object.keys(fields).length - 1;

      form.setFieldsValue({
        [`subCategory_${index - 1}`]: newSubCategory,
      });

      setSelectedOptions(prevOptions => {
        const newOptions = [...prevOptions];
        newOptions[index - 1] = String(newSubCategory);
        return newOptions;
      });
      setCategory?.(String(newSubCategory));
    }
  }, [newSubCategory, form, setSelectedOptions]);

  return (
    <div className={styles.container}>
      <div className={styles.flexContainer}>
        <Form.Item
          name="category"
          label={<LabelTitle text="Категория" />}
          colon={false}
          className={styles.formItem}
          rules={[
            {
              required: true,
              message: 'Поле обязательно для заполнения.',
            },
          ]}
        >
          <Select
            getPopupContainer={getPopupContainer}
            onChange={handleCategorySelect}
            placeholder="Выберите из списка"
            notFoundContent={
              <span style={{ paddingLeft: '10px' }}>Категории не найдены</span>
            }
            options={categories.map(category => ({
              key: category.id,
              value: category.id,
              label: category.name,
            }))}
            dropdownRender={menu => (
              <>
                {!!categories.length ? (
                  <>
                    <Button
                      className={classNames([
                        styles.itemSelect,
                        'button-transparent',
                      ])}
                      onClick={() => {
                        openModalCreateCategory(true);
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
                    onClick={() => {
                      openModalCreateCategory(true);
                    }}
                  >
                    <PlusIcon />
                    <span>Добавить новый вариант</span>
                  </Button>
                )}
              </>
            )}
          />
        </Form.Item>
      </div>
      {selectedOptions.map((optionId, index) => {
        const subCategoryOptions = categoriesDic[parseInt(optionId)]?.map(
          subCategory => ({
            key: subCategory.id,
            value: subCategory.id,
            label: subCategory.name,
          }),
        );

        return (
          <div key={optionId} className={styles.flexContainer}>
            <Form.Item
              name={`subCategory_${index + 1}`}
              label={<LabelTitle text="Подкатегория" />}
              colon={false}
              className={styles.formItem}
            >
              <Select
                getPopupContainer={getPopupContainer}
                value={index === selectedOptions.length - 1 ? '' : optionId} // Пустое значение для последнего Select
                onChange={handleSubCategorySelect(index)}
                placeholder="Выберите из списка"
                notFoundContent={
                  <span style={{ paddingLeft: '10px' }}>
                    Подкатегории не найдены
                  </span>
                }
                options={subCategoryOptions}
                dropdownRender={menu => (
                  <>
                    <Button
                      className={classNames([
                        styles.itemSelect,
                        'button-transparent',
                      ])}
                      onClick={() => {
                        openModalCreateSubCategory(true);
                      }}
                    >
                      <PlusIcon />
                      <span>Добавить новый вариант</span>
                    </Button>
                    {menu}
                  </>
                )}
              />
            </Form.Item>
          </div>
        );
      })}
    </div>
  );
}
