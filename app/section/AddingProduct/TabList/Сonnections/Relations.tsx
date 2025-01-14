import PageContent from '@/app/components/PageContent/PageContent';
import styles from './relations.module.css';
import { Button, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import PlusIcon from '@/public/plus.svg';
import ArrowLeftIcon from '@/public/arrow-left.svg';
import { Title } from '@/app/components/Title/Title';
import { useContext, useState } from 'react';
import Relation from './Components/Relation/Relation';
import { ProductContext } from '@/context/AddProduct/addProduct.context';

export interface ICharacteristic {
  name: string;
  value: number;
}

export default function TabRelations(): React.ReactElement {
  const router = useRouter();
  const [isOpenModalAddRelation, setIsOpenModalAddRelation] =
    useState<boolean>(false);
  const { setShouldShowComponent, dataProduct } = useContext(ProductContext);

  const showAddingRelations = () => {
    setShouldShowComponent(state => ({
      ...state,
      showAddingRelations: true,
    }));
  };

  return (
    <div>
      {!!dataProduct.connections?.length ? (
        <>
          {dataProduct.connections.map((relation, index) => (
            <Relation relation={relation} key={index} />
          ))}
          <PageContent>
            <div className={styles.addValueButton}>
              <Button className="button-white" onClick={showAddingRelations}>
                <PlusIcon />
                Создать связь
              </Button>
            </div>
          </PageContent>
        </>
      ) : (
        <PageContent className={styles.noRelations}>
          <div>
            <Title tag="h3">Связи не созданы</Title>
            <div>
              <div className={styles.text}>
                Здесь будут созданные вами связи между значениями характеристик
                разных товаров в каталоге.
              </div>
              <div className={styles.addValueButton}>
                <Button className="button-white" onClick={showAddingRelations}>
                  <PlusIcon />
                  Создать связь
                </Button>
              </div>
            </div>
          </div>
        </PageContent>
      )}
      <div className={styles.buttonWrapper}>
        <Button
          onClick={() => router.push('/')}
          className={classNames(['button-transparent'])}
        >
          Отмена
        </Button>
        <div className={styles.rightBlockBtn}>
          <Button
            className={classNames(['button-transparent', styles.buttonBack])}
            onClick={router.back}
          >
            <ArrowLeftIcon />
            <span>Назад</span>
          </Button>
          <Button
            className={classNames(['button-primary', styles.button])}
            htmlType="submit"
          >
            Сохранить
          </Button>
        </div>
      </div>
      <Modal
        open={isOpenModalAddRelation}
        onCancel={() => setIsOpenModalAddRelation(false)}
        centered
        className={styles.modalDelete}
        title={null}
        footer={null}
        width={480}
      >
        123
      </Modal>
    </div>
  );
}
