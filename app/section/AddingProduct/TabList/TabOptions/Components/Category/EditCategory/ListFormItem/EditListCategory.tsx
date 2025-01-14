import { Button, Form, Modal, Select } from 'antd';
import styles from './editListCategory.module.css';
import PlusIcon from '@/public/plus.svg';
import { EditListCategoryProps } from './editListCategory.props';
import classNames from 'classnames';
import { useContext, useState } from 'react';
import CreateNewCategory from './Modal/CreateNewCategory';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { getPopupContainer } from '@/data/utils.common';

export default function EditListCategory({
  categories,
  subCategories,
}: EditListCategoryProps) {
  const [isOpenModalCreateCategory, setIsOpenModalCreateCategory] =
    useState<boolean>(false);
  const { dataProduct } = useContext(ProductContext);

  return (
    <>
      <div className={styles.container}>
        <Form.Item
          name="category"
          label={<LabelTitle text="Категория" />}
          colon={false}
          className={styles.formItem}
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
                {!!categories.length ? (
                  <>
                    <Button
                      className={classNames([
                        styles.itemSelect,
                        'button-transparent',
                      ])}
                      onClick={e => {
                        e.preventDefault(), setIsOpenModalCreateCategory(true);
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
                      e.preventDefault(), setIsOpenModalCreateCategory(true);
                    }}
                  >
                    <PlusIcon />
                    <span>Добавить новый вариант</span>
                  </Button>
                )}
              </>
            )}
            options={[
              ...categories.map(item => ({
                key: item.id,
                value: item.name,
                label: item.name,
              })),
            ]}
          />
        </Form.Item>
      </div>
      <div className={styles.flexContainer}>
        <Form.Item
          name="subCategory"
          label={<LabelTitle text="Подкатегория" />}
          colon={false}
          className={styles.formItem}
        >
          <Select
            getPopupContainer={getPopupContainer}
            placeholder="Выберите из списка"
            notFoundContent={
              <span style={{ paddingLeft: '10px' }}>
                Подкатегории не найдены
              </span>
            }
            options={[
              ...subCategories.map(item => ({
                key: item.id,
                value: item.name,
                label: item.name,
              })),
            ]}
          />
        </Form.Item>
      </div>

      <div className={styles.flexContainer}>
        <Form.Item
          name="additionalSubCategory"
          label={<LabelTitle text="Подкатегория" />}
          colon={false}
          className={styles.formItem}
        >
          <Select
            getPopupContainer={getPopupContainer}
            placeholder="Выберите из списка"
            notFoundContent={
              <span style={{ paddingLeft: '10px' }}>Марки не найдены</span>
            }
            options={[
              ...subCategories.map(item => ({
                key: item.id,
                value: item.name,
                label: item.name,
              })),
            ]}
          />
        </Form.Item>
      </div>
      <Modal
        open={isOpenModalCreateCategory}
        onCancel={() => setIsOpenModalCreateCategory(false)}
        centered
        className={styles.modalDelete}
        title="Добавление новой категории"
        footer={null}
        width={600}
        zIndex={2000}
      >
        <CreateNewCategory
          setIsOpenModalCreateCategory={setIsOpenModalCreateCategory}
        />
      </Modal>
    </>
  );
}
