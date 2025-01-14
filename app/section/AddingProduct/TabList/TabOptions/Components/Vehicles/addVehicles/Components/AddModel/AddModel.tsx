import {
  Button,
  Form,
  FormInstance,
  Input,
  Modal,
  Select,
  Tooltip,
} from 'antd';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import styles from './addModel.module.css';
import { useEffect, useState } from 'react';
import PlusIcon from '@/public/plus.svg';
import NotificationIcon from '@/public/notification.svg';
import CreateNewAutoModel from '../../Modal/CreateNewAutoModel';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import { IAutoModel } from '@/interface/addingProduct/options.interface';
import { getPopupContainer } from '@/data/utils.common';

const Editor = dynamic(() => import('@/app/components/Editor/Editor'), {
  ssr: false,
});

interface IProps {
  form: FormInstance<any>;
  removeModel: (productAutoModel: any, fieldName: number) => void;
  fieldName: number;
  autoModels?: IAutoModel[];
  typeId: number;
  brandId: number;
  fetchAutoModel: (typeId: number, brandId: number) => Promise<void>;
  initialDescription?: string;
}

export default function AddModel({
  form,
  removeModel,
  fieldName,
  autoModels,
  typeId,
  brandId,
  fetchAutoModel,
  initialDescription,
}: IProps) {
  // Модальное окно для добавление модели
  const [isOpenModalAddModel, setIsOpenModalAddModel] =
    useState<boolean>(false);
  const [newAutoModel, setNewAutoModel] = useState<number>();
  const deletingModel = () => {
    const model = form?.getFieldValue(['autoModels', fieldName]);
    if (model) {
      removeModel(model.id, fieldName);
    }
  };

  useEffect(() => {
    if (newAutoModel) {
      form.setFieldsValue({
        autoModels: {
          [fieldName]: { model: newAutoModel },
        },
      });
    }
  }, [newAutoModel, fieldName, form]);

  return (
    <div className={classNames(['neutral-container', styles.addModel])}>
      <Button
        className={classNames([styles.buttonDeleteModel, 'button-transparent'])}
        onClick={deletingModel}
      >
        <DeleteIcon />
      </Button>
      <div className={styles.flexContainer}>
        <Form.Item
          className={styles.formItem}
          name={[fieldName, 'model']}
          label={<LabelTitle text="Модель" />}
          colon={false}
          rules={[
            {
              required: true,
              message: 'Обязательно для заполнения',
            },
          ]}
        >
          <Select
            className={styles.select}
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
        </Form.Item>
        <Form.Item
          className={styles.formItem}
          label={
            <div className={styles.label}>
              <LabelTitle text="Количество деталей (необязательно)" />
              <Tooltip
                title="Количество деталей на транспортном средстве."
                className={styles.notification}
                getPopupContainer={getPopupContainer}
              >
                <NotificationIcon />
              </Tooltip>
            </div>
          }
          name={[fieldName, 'amount']}
        >
          <Input className={styles.input} placeholder="Введите значение" />
        </Form.Item>
      </div>
      <Form.Item
        name={[fieldName, 'identifyMethod']}
        label={<LabelTitle text="Метод идентификации (необязательно)" />}
      >
        <Editor
          placeholder="Опишите метод идентификации"
          initialValue={initialDescription}
        />
      </Form.Item>
      <Form.Item
        label={<LabelTitle text="Ссылка на внешнюю схему (необязательно)" />}
        name={[fieldName, 'externalScheme']}
      >
        <Input className={styles.input} placeholder="Укажите ссылку" />
      </Form.Item>
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
          typeId={typeId}
          brandId={brandId}
          fetchAutoModel={fetchAutoModel}
        />
      </Modal>
    </div>
  );
}
