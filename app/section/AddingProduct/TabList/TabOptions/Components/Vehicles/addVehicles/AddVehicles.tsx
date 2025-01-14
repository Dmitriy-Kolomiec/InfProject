import { Button, Form, Modal, Select, Tag } from 'antd';
import styles from './addVehicles.module.css';
import { Dispatch, SetStateAction, useEffect } from 'react';
import PageContent from '@/app/components/PageContent/PageContent';
import classNames from 'classnames';
import CloseIcon from '@/public/close.svg';
import PlusIcon from '@/public/plus.svg';
import { Title } from '@/app/components/Title/Title';
import NotificationDanger from '@/app/components/Notification/Danger';
import CreateNewAutoType from './Modal/CreateNewAutoType';
import CreateNewAutoBrand from './Modal/CreateNewAutoBrand';
import { getPopupContainer, onFormFieldsChange } from '@/data/utils.common';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { useAddVehicles } from './useAddVehicles.hook';
import CreateNewAutoModel from './Modal/CreateNewAutoModel';
import { ITags } from '@/interface/addingProduct/addPartNumber.interface';

const CHECKING_FIELDS_NAME = ['type', 'brand'];

interface IProps {
  hideModal?: Dispatch<SetStateAction<boolean>>;
}

export default function AddVehicles({ hideModal }: IProps) {
  const {
    form,
    isDisabledFormSubmit,
    setIsDisabledFormSubmit,
    isOpenModalAddType,
    setIsOpenModalAddType,
    isOpenModalAddBrand,
    setIsOpenModalAddBrand,
    typeId,
    brandId,
    autoTypes,
    autoBrands,
    autoModels,
    fetchAutoTypes,
    fetchAutoBrands,
    fetchAutoModel,
    handleTypeChange,
    handleBrandChange,
    onFinish,
    hidenAddVehicles,
    newType,
    setNewType,
    newBrand,
    setNewBrand,
    isLoader,
    isOpenModalAddModel,
    setIsOpenModalAddModel,
    newAutoModel,
    setNewAutoModel,
    tags,
    handleTagClose,
    handleClearTags,
    onChangeModel,
  } = useAddVehicles({ hideModal });

  useEffect(() => {
    fetchAutoTypes();
    form.resetFields(['brand', 'model']);
    handleClearTags();
    if (newType) {
      form.setFieldsValue({ type: newType });
    }
  }, [typeId, form, newType]);

  useEffect(() => {
    if (typeId) {
      fetchAutoBrands();
      form.resetFields(['model']);
    }
    if (newBrand) {
      form.setFieldsValue({ brand: newBrand });
    }
  }, [typeId, brandId, form, newBrand]);

  useEffect(() => {
    if (newType && newBrand) {
      fetchAutoModel(newType, newBrand);
    }
    if (typeId && brandId) {
      fetchAutoModel(typeId, brandId);
    }
  }, [brandId, typeId, newBrand, newType]);

  useEffect(() => {
    if (newAutoModel) {
      form.setFieldsValue({
        model: newAutoModel,
      });
    }
  }, [newAutoModel, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      onFieldsChange={changedFields =>
        onFormFieldsChange(
          form,
          setIsDisabledFormSubmit,
          CHECKING_FIELDS_NAME,
          changedFields,
        )
      }
    >
      <PageContent className={styles.container}>
        <div>
          <Button
            className={classNames([styles.closeIcon, 'button-transparent'])}
            onClick={hidenAddVehicles}
          >
            <CloseIcon />
          </Button>
          <Title tag="h3">Добавление транспортного средства</Title>
        </div>
        <Form.Item
          name="type"
          label={<LabelTitle text="Тип" />}
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
            onChange={handleTypeChange}
            placeholder="Выберите из списка"
            dropdownRender={menu => (
              <>
                {autoTypes && autoTypes.length > 0 ? (
                  <>
                    <Button
                      className={classNames([
                        styles.itemSelect,
                        'button-transparent',
                      ])}
                      onClick={e => {
                        e.preventDefault();
                        setIsOpenModalAddType(true);
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
                      setIsOpenModalAddType(true);
                    }}
                  >
                    <PlusIcon />
                    <span>Добавить новый вариант</span>
                  </Button>
                )}
              </>
            )}
            options={autoTypes?.map(type => ({
              key: type.id,
              value: type.id,
              label: type.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="brand"
          label={<LabelTitle text="Бренд" />}
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
            onChange={handleBrandChange}
            disabled={!typeId}
            placeholder="Выберите из списка"
            dropdownRender={menu => (
              <>
                {!!autoBrands?.length ? (
                  <>
                    <Button
                      className={classNames([
                        styles.itemSelect,
                        'button-transparent',
                      ])}
                      onClick={e => {
                        e.preventDefault();
                        setIsOpenModalAddBrand(true);
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
                      setIsOpenModalAddBrand(true);
                    }}
                  >
                    <PlusIcon />
                    <span>Добавить новый вариант</span>
                  </Button>
                )}
              </>
            )}
            options={autoBrands?.map(brand => ({
              key: brand.id,
              value: brand.id,
              label: brand.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          className={styles.formItem}
          name="model"
          label={<LabelTitle text="Модель" />}
          colon={false}
        >
          <div>
            <Select
              getPopupContainer={getPopupContainer}
              onChange={onChangeModel}
              mode="multiple"
              disabled={!brandId}
              className="select-tags"
              placeholder="Выберите из списка"
              dropdownRender={menu => (
                <>
                  {!!autoModels?.length ? (
                    <>
                      <Button
                        className={classNames([
                          styles.itemSelect,
                          'button-transparent',
                        ])}
                        onClick={e => {
                          e.preventDefault();
                          setIsOpenModalAddModel(true);
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
                        setIsOpenModalAddModel(true);
                      }}
                    >
                      <PlusIcon />
                      <span>Добавить новый вариант</span>
                    </Button>
                  )}
                </>
              )}
              options={autoModels?.map(model => ({
                key: model.id,
                value: model.id,
                label: model.name,
              }))}
            />
            {tags.length >= 1 && (
              <Tag className={classNames([styles.clearTagsSelect, styles.tag])}>
                <span className={styles.countTags}>{tags.length}</span>
                <Button
                  className={classNames([
                    styles.clearTagsButton,
                    'button-transparent',
                  ])}
                  onClick={handleClearTags}
                >
                  <CloseIcon />
                </Button>
              </Tag>
            )}
          </div>
        </Form.Item>
        {tags.length >= 1 && (
          <div className={styles.tags}>
            {tags?.map((tag: ITags, index: number) => (
              <Tag
                onClose={() => handleTagClose(tag)}
                key={index}
                closable
                className={styles.tag}
              >
                {tag.name}
              </Tag>
            ))}
            {tags.length >= 2 && (
              <Tag
                className={classNames([styles.tag, styles.clearAll])}
                onClick={handleClearTags}
              >
                Очистить всё
              </Tag>
            )}
          </div>
        )}

        {isDisabledFormSubmit && (
          <NotificationDanger text="Не заполнены обязательные поля." />
        )}
        <div className={styles.buttonWrapper}>
          <Button className="button-transparent" onClick={hidenAddVehicles}>
            Отмена
          </Button>
          <Button
            disabled={isDisabledFormSubmit}
            className="button-primary"
            htmlType="submit"
            loading={isLoader}
          >
            Сохранить
          </Button>
        </div>
      </PageContent>
      <Modal
        open={isOpenModalAddType}
        onCancel={() => setIsOpenModalAddType(false)}
        centered
        title="Добавление нового типа транспортного средства"
        footer={null}
        width={600}
        zIndex={2000}
      >
        <CreateNewAutoType
          setNewType={setNewType}
          hideModal={setIsOpenModalAddType}
          fetchAutoTypes={fetchAutoTypes}
        />
      </Modal>
      <Modal
        open={isOpenModalAddBrand}
        onCancel={() => setIsOpenModalAddBrand(false)}
        centered
        title="Добавление нового бренда транспортного средства"
        footer={null}
        width={600}
        zIndex={2000}
      >
        <CreateNewAutoBrand
          setNewBrand={setNewBrand}
          hideModal={setIsOpenModalAddBrand}
          fetchAutoBrands={fetchAutoBrands}
          typeId={typeId}
        />
      </Modal>
      <Modal
        open={isOpenModalAddModel}
        onCancel={() => setIsOpenModalAddModel(false)}
        centered
        className={styles.modalDelete}
        title="Добавление новой модели транспортного средства"
        footer={null}
        width={600}
        zIndex={2000}
      >
        <CreateNewAutoModel
          setNewAutoModel={setNewAutoModel}
          hideModal={setIsOpenModalAddModel}
          typeId={typeId!}
          brandId={brandId!}
          fetchAutoModel={fetchAutoModel}
        />
      </Modal>
    </Form>
  );
}
