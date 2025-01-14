import { Form, Input } from 'antd';
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import styles from './basicDescription.module.css';
import { Title } from '@/app/components/Title/Title';
import dynamic from 'next/dynamic';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import LabelTitle from '@/app/components/LabelTitle/LabelTitle';
import FileUpload from '@/app/components/FileUpload/FileUpload';
import { IProduct } from '@/interface/addingProduct/product.interface';

const Editor = dynamic(() => import('@/app/components/Editor/Editor'), {
  ssr: false,
});
interface IProps {
  setFileIdsDescription: Dispatch<SetStateAction<number[]>>;
}

export default function BasicDescription({
  setFileIdsDescription,
}: IProps): React.ReactElement {
  const { dataProduct } = useContext(ProductContext);
  const [productData, setProductData] = useState<IProduct>(
    dataProduct.product || {},
  );

  // Обновление productData при изменении dataProduct
  useEffect(() => {
    setProductData(dataProduct.product || {});
  }, [dataProduct.product]);

  return (
    <>
      <Title className={styles.title} tag="h3">
        Основная информация
      </Title>
      <Form.Item
        key={productData.name}
        name="name"
        label={
          <div className={styles.labelBlock}>
            <LabelTitle text="Название (обязательно)" />
            <span className={styles.labelSubTitle}>
              Будет выводиться в карточке товара
            </span>
          </div>
        }
        rules={[
          {
            required: true,
            message: 'Поле обязательно для заполнения.',
          },
        ]}
        initialValue={productData.name}
      >
        <Input className={styles.input} placeholder="Введите название товара" />
      </Form.Item>
      <Form.Item
        key={productData.additionalNames}
        name="additionalNames"
        label={
          <div className={styles.labelBlock}>
            <LabelTitle text="Дополнительные названия" />
            <span className={styles.labelSubTitle}>
              Укажите альтернативные названия через запятую. Они не будут
              выводиться в карточке товара, <br />
              но нужны для поисковых запросов пользователя.
            </span>
          </div>
        }
        className={styles.textArea}
        initialValue={productData.additionalNames}
      >
        <Input.TextArea placeholder="Введите названия через запятую" />
      </Form.Item>
      <div>
        <Form.Item name="description" label={<LabelTitle text="Описание" />}>
          <Editor
            placeholder="Введите описание товара"
            initialValue={productData.description}
          />
        </Form.Item>
        <FileUpload
          setFileIdsDescription={setFileIdsDescription}
          initialData={productData.files}
          urlPath="product"
        />
      </div>
    </>
  );
}
