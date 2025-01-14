import PageContent from '@/app/components/PageContent/PageContent';
import styles from './addManufacturer.module.css';
import { Button, Form, FormInstance, Modal, Radio, Select } from 'antd';
import dynamic from 'next/dynamic';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import PlusIcon from '@/public/plus.svg';
import CreateNewManufacturer from '../../../Modal/CreateNewManufacturer';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { IAddManufacturer } from '@/interface/addingProduct/addPartNumber.interface';
import { getPopupContainer } from '@/data/utils.common';

const Editor = dynamic(() => import('@/app/components/Editor/Editor'), {
  ssr: false,
});

interface IProps {
  form: FormInstance<any>;
  remove: (index: number | number[]) => void;
  fieldName: number;
  initialDescription?: string;
}

export function AddManufacturer({
  form,
  remove,
  fieldName,
  initialDescription,
}: IProps) {
  const [isOpenModalAddManufacturer, setIsOpenModalAddManufacturer] =
    useState<boolean>(false);
  const [manufacturers, setManufacturers] = useState<IAddManufacturer[]>();
  const [newManufacturId, setNewManufacturerId] = useState<number>();

  const fetchManufacturers = async () => {
    try {
      const response = await APIRequest.get(API_ENDPOINTS.GET_MANUFACTURERS);
      setManufacturers(response.data);
    } catch (error) {
      console.error('Ошибка при получении моделей автомобилей:', error);
    }
  };

  useEffect(() => {
    fetchManufacturers();
    if (newManufacturId) {
      form.setFieldsValue({
        manufacturers: {
          [fieldName]: { manufacturerId: newManufacturId },
        },
      });
    }
  }, [newManufacturId]);

  return (
    <PageContent className={styles.container}>
      <Button
        className={classNames([styles.closeIcon, 'button-transparent'])}
        onClick={() => remove(fieldName)}
      >
        <DeleteIcon />
      </Button>
      <div className={styles.title}>Производитель</div>

      <Form.Item
        name={[fieldName, 'manufacturerId']}
        label={<LabelTitle text="Название производителя" />}
        colon={false}
        className={styles.selectBlock}
      >
        <Select
          getPopupContainer={getPopupContainer}
          className={styles.select}
          // onChange={handleChange}
          placeholder="Выберите из списка"
          options={manufacturers?.map(item => ({
            key: item.id,
            value: item.id,
            label: item.name,
          }))}
          dropdownRender={menu => (
            <>
              {!!manufacturers?.length ? (
                <>
                  <Button
                    className={classNames([
                      styles.itemSelect,
                      'button-transparent',
                    ])}
                    onClick={() => setIsOpenModalAddManufacturer(true)}
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
                  onClick={() => setIsOpenModalAddManufacturer(true)}
                >
                  <PlusIcon />
                  <span>Добавить новый вариант</span>
                </Button>
              )}
            </>
          )}
        />
      </Form.Item>
      <Form.Item
        label={
          <LabelTitle text="Оцените опыт экспплуатации товара от данного производителя от 1 до 5, где 1 – крайне негативный, 5 – крайне позитивный." />
        }
        name={[fieldName, 'rating']}
        initialValue={'Не задан'}
      >
        <Radio.Group>
          <Radio value="Не задан" name="null">
            Не задан
          </Radio>
          <Radio value="1" name="one">
            1
          </Radio>
          <Radio value="2" name="two">
            2
          </Radio>
          <Radio value="3" name="three">
            3
          </Radio>
          <Radio value="4" name="four">
            4
          </Radio>
          <Radio value="5" name="five">
            5
          </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name={[fieldName, 'review']}
        label={
          <LabelTitle text="Описание опыта эксплуатации (необязательно)" />
        }
      >
        <Editor
          placeholder="Расскажите о сложностях и/или преимуществах работы с данным изделием."
          initialValue={initialDescription}
        />
      </Form.Item>
      <Modal
        open={isOpenModalAddManufacturer}
        onCancel={() => setIsOpenModalAddManufacturer(false)}
        centered
        className={styles.modalDelete}
        title="Добавление нового производителя"
        footer={null}
        width={600}
        zIndex={2000}
      >
        <CreateNewManufacturer
          setNewManufacturerId={setNewManufacturerId}
          hideModal={setIsOpenModalAddManufacturer}
          fetchManufacturers={fetchManufacturers}
        />
      </Modal>
    </PageContent>
  );
}
