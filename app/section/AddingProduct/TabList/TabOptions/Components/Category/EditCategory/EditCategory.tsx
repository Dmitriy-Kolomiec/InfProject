import React, { useContext, useState } from 'react';
import { TabCategoriesProps } from './editCategory.props';
import classNames from 'classnames';
import styles from './editCategory.module.css';
import { Title } from '@/app/components/Title/Title';
import PageContent from '@/app/components/PageContent/PageContent';
import { Button, Form } from 'antd';
import { useRouter } from 'next/navigation';
import DeleteIcon from '@/public/deleteBgBlack.svg';
import CloseIcon from '@/public/close.svg';
import { useEditCategories } from './useEditCategory.hook';
import EditListCategory from './ListFormItem/EditListCategory';
import NotificationDanger from '@/app/components/Notification/Danger';
import { onFormFieldsChange } from '@/data/utils.common';
import { ProductContext } from '@/context/AddProduct/addProduct.context';

const CHECKING_FIELDS_NAME = ['category'];

export default function EditCategory({}: TabCategoriesProps): React.ReactElement {
  const [form] = Form.useForm();
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { setShouldShowComponent } = useContext(ProductContext);

  const {
    categories,
    subCategories,
    category,
    subCategory,
    additionalSubCategory,
    handleCategoryChange,
    handleSubCategoryChange,
    handleAdditionalSubCategoryChange,
  } = useEditCategories();

  const editCategory = (value: any) => {
    // setDataProduct(state => ({
    //   ...state,
    //   categories: [
    //     ...(state.categories || []),
    //     {
    //       id: value.idCategory,
    //       category: value.category,
    //       subCategory: value.subCategory,
    //       additionalSubCategory: value.additionalSubCategory,
    //     },
    //   ],
    // }));
    setShouldShowComponent(state => ({
      ...state,
      showAddingCategory: false,
    }));
    form.resetFields();
  };

  const hideEditCategory = () => {
    setShouldShowComponent(state => ({
      ...state,
      showEditCategory: false,
    }));
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={editCategory}
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
            onClick={hideEditCategory}
          >
            <CloseIcon />
          </Button>
          editCategory
          <div className={styles.title}>
            {category && <Title tag="h3">{category}</Title>}
            {category && (
              <Title tag="h3">
                {category}
                {subCategory && ` / ${subCategory}`}
                {}
              </Title>
            )}
          </div>
          <EditListCategory
            categories={categories}
            subCategories={subCategories}
            category={category}
            subCategory={subCategory}
            additionalSubCategory={additionalSubCategory}
            handleCategoryChange={handleCategoryChange}
            handleSubCategoryChange={handleSubCategoryChange}
            handleAdditionalSubCategoryChange={
              handleAdditionalSubCategoryChange
            }
          />
          {isDisabled && (
            <NotificationDanger
              text="Не заполнены обязательные поля."
              className={styles.notification}
            />
          )}
          <div className={styles.buttonWrapper}>
            <Button
              onClick={hideEditCategory}
              className={classNames(['button-transparent'])}
            >
              Отмена
            </Button>
            <div className={styles.rightBlockBtn}>
              <Button
                className={classNames(['button-transparent', styles.button])}
                onClick={router.back}
              >
                <DeleteIcon />
                <span>Удалить</span>
              </Button>
              <Button className={'button-primary'} htmlType="submit">
                Сохранить
              </Button>
            </div>
          </div>
        </PageContent>
      </Form>
    </>
  );
}
