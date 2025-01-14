import React, { useEffect } from 'react';
import { AddCategoryProps } from './addCategory.props';
import classNames from 'classnames';
import styles from './addCategory.module.css';
import { Title } from '@/app/components/Title/Title';
import PageContent from '@/app/components/PageContent/PageContent';
import { Button, Form, Modal } from 'antd';
import CloseIcon from '@/public/close.svg';
import { useCategories } from './useAddCategory.hook';
import ListFormItem from './ListFormItem/ListFormItem';
import NotificationDanger from '@/app/components/Notification/Danger';
import { onFormFieldsChange } from '@/data/utils.common';
import CreateNewCategory from './ListFormItem/Modal/CreateNewCategory';
import CreateNewSubCategory from './ListFormItem/Modal/CreateNewSubCategory';

const CHECKING_FIELDS_NAME = ['category'];

export default function AddCategory({}: AddCategoryProps): React.ReactElement {
  const {
    categories,
    category,
    handleSubCategoryChange,
    handleCategoryChange,
    fetchCategories,
    fetchSubCategory,
    categoriesDic,
    handleSubmitAddCategory,
    hideAddingCategory,
    form,
    setLastCategoryId,
    isDisabled,
    setIsDisabled,
    isOpenModalCreateCategory,
    setIsOpenModalCreateCategory,
    selectedOptions,
    setSelectedOptions,
    isOpenModalCreateSubCategory,
    setIsOpenModalCreateSubCategory,
    setNewCategory,
    newSubCatetory,
    setSubNewCategory,
    setCategory,
    isLoader,
  } = useCategories();

  useEffect(() => {
    const selectReset = () => {
      form.resetFields([`subCategory_${selectedOptions.length}`]);
    };
    selectReset();
  }, [selectedOptions, form]);

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmitAddCategory}
        requiredMark={false}
        className={styles.form}
        onFieldsChange={changedFields =>
          onFormFieldsChange(
            form,
            setIsDisabled,
            CHECKING_FIELDS_NAME,
            changedFields,
          )
        }
      >
        <PageContent className={styles.container}>
          <Button
            className={classNames([styles.closeIcon, 'button-transparent'])}
            onClick={hideAddingCategory}
          >
            <CloseIcon />
          </Button>
          <div className={styles.title}>
            <Title tag="h3">Добавление категории</Title>
          </div>
          <ListFormItem
            setCategory={setCategory}
            form={form}
            categories={categories}
            setLastCategoryId={setLastCategoryId}
            handleSubCategoryChange={handleSubCategoryChange}
            handleCategoryChange={handleCategoryChange}
            openModalCreateCategory={setIsOpenModalCreateCategory}
            openModalCreateSubCategory={setIsOpenModalCreateSubCategory}
            categoriesDic={categoriesDic}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            newSubCategory={newSubCatetory}
          />
          {isDisabled && (
            <div className={styles.notification}>
              <NotificationDanger text="Не заполнены обязательные поля." />
            </div>
          )}
          <div className={styles.buttonWrapper}>
            <Button
              onClick={hideAddingCategory}
              className={classNames(['button-transparent'])}
            >
              Отмена
            </Button>
            <div className={styles.rightBlockBtn}>
              <Button
                className={'button-primary'}
                htmlType="submit"
                disabled={isDisabled}
                loading={isLoader}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </PageContent>
      </Form>
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
          setNewCategory={setNewCategory}
          hideModal={setIsOpenModalCreateCategory}
          fetchCategories={fetchCategories}
        />
      </Modal>
      <Modal
        open={isOpenModalCreateSubCategory}
        onCancel={() => setIsOpenModalCreateSubCategory(false)}
        centered
        className={styles.modalDelete}
        title="Добавление новой подкатегории"
        footer={null}
        width={600}
        zIndex={2000}
      >
        <CreateNewSubCategory
          setSubNewCategory={setSubNewCategory}
          lastCategoryId={category}
          hideModal={setIsOpenModalCreateSubCategory}
          fetchSubCategory={fetchSubCategory}
        />
      </Modal>
    </>
  );
}
