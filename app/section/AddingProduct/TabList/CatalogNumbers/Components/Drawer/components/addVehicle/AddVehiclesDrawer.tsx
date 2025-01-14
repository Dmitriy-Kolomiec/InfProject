import PageContent from '@/app/components/PageContent/PageContent';
import styles from './addVehicleDrawer.module.css';
import { Button, Form, Input, Select, Tooltip } from 'antd';
import dynamic from 'next/dynamic';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import classNames from 'classnames';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import PlusIcon from '@/public/plus.svg';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import NotificationIcon from '@/public/notification.svg';
import { IDataProduct } from '@/interface/addingProduct/product.interface';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import AnimateHeight from 'react-animate-height';
import Image from 'next/image';
import { getPopupContainer } from '@/data/utils.common';

const Editor = dynamic(() => import('@/app/components/Editor/Editor'), {
  ssr: false,
});

interface IProps {
  isOpenModalAddVehicle: Dispatch<SetStateAction<boolean>>;
  remove: (index: number | number[]) => void;
  fieldName: number;
  initialIdentifyMethod?: string;
}

export function AddVehiclesDrawer({
  remove,
  fieldName,
  initialIdentifyMethod,
  isOpenModalAddVehicle,
}: IProps) {
  const [isListOpenVehicles, setIsListOpenVehicles] = useState<boolean>(true);
  const { dataProduct } = useContext(ProductContext);
  const toggleListVehicles = () => {
    setIsListOpenVehicles(!isListOpenVehicles);
  };

  const renderOptions = (dataProduct: IDataProduct) => {
    return Object.entries(dataProduct.vehicle || {}).map(([key, value]) => ({
      label: (
        <span
          key={`label_${key}_${value.autoType.id}`}
          className={styles.titleSelect}
        >
          {`${value.autoType.name} / ${value.autoBrand.name}`}
        </span>
      ),
      options: value.autoModels.map(model => {
        return {
          key: `option_${key}_${model.id}`,
          label: model.name,
          value: model.id,
        };
      }),
    }));
  };

  return (
    <PageContent className={styles.container}>
      <div className={styles.header}>
        <Button
          className={classNames([styles.closeIcon, 'button-transparent'])}
          onClick={() => remove(fieldName)}
        >
          <DeleteIcon />
        </Button>
        <div className={styles.title}>
          <Button
            className={classNames([styles.button, 'button-transparent'])}
            onClick={toggleListVehicles}
          >
            <Image
              className={classNames([styles.arrowIcon], {
                [styles.arrowIconOpen]: isListOpenVehicles,
              })}
              src="/arrow-down.svg"
              width={20}
              height={20}
              alt="icon"
            />
          </Button>
          <div>Транспортное средство</div>
        </div>
      </div>

      <AnimateHeight duration={300} height={isListOpenVehicles ? 'auto' : 0}>
        <Form.Item
          name={[fieldName, 'vehicleId']}
          label={
            <div className={styles.labelBlock}>
              <LabelTitle text="Транспортное средство" />
              <span className={styles.labelSubTitle}>
                Если нужного транспортного средства нет в списке – добавьте его
                на шаге «Параметры».
              </span>
            </div>
          }
          colon={false}
          className={styles.selectBlock}
        >
          <Select
            className={styles.select}
            options={renderOptions(dataProduct)}
            placeholder="Выберите из списка"
            dropdownRender={menu => (
              <>
                {!!dataProduct.vehicle?.length ? (
                  <>
                    <Button
                      className={classNames([
                        styles.itemSelect,
                        'button-transparent',
                      ])}
                      onClick={() => isOpenModalAddVehicle(true)}
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
                    onClick={() => isOpenModalAddVehicle(true)}
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
        <Form.Item
          name={[fieldName, 'identifyMethod']}
          label={<LabelTitle text="Метод идентификации (необязательно)" />}
        >
          <Editor
            placeholder="Опишите метод идентификации"
            initialValue={initialIdentifyMethod}
          />
        </Form.Item>
        <Form.Item
          label={<LabelTitle text="Ссылка на внешнюю схему (необязательно)" />}
          name={[fieldName, 'externalScheme']}
        >
          <Input className={styles.input} placeholder="Укажите ссылку" />
        </Form.Item>
      </AnimateHeight>
    </PageContent>
  );
}
