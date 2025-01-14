import { TabOptionsProps } from './options.props';
import { Button, Modal } from 'antd';
import styles from './options.module.css';
import classNames from 'classnames';
import ArrowIcon from '@/public/arrowNext.svg';
import ArrowLeftIcon from '@/public/arrow-left.svg';
import { ModalDeleteCategoryProduct } from './Components/OpeningLists/categories/components/ModalDeleteCategory';
import { Categories } from './Components/OpeningLists/categories/Categories';
import Properties from './Components/OpeningLists/Properties/Properties';
import Vehicles from './Components/OpeningLists/vehicles/Vehicles';
import { useOptions } from './options.hook';

export default function TabOptions({}: TabOptionsProps): React.ReactElement {
  const {
    router,
    dataProduct,
    isOpenModalDeleting,
    setIsOpenModalDeleting,
    aboutCategoryDeleted,
    deleteCategory,
    handleNextTab,
    handlePreviousTab,
  } = useOptions();

  return (
    <>
      <Categories
        categories={dataProduct.categories}
        deleteCategory={deleteCategory}
      />
      <Properties properties={dataProduct.properties} />
      <Vehicles vehicle={dataProduct.vehicle} />
      <div className={styles.buttonWrapper}>
        <Button
          onClick={() => router.push('/')}
          className={classNames(['button-transparent'])}
        >
          Отмена
        </Button>
        <div className={styles.rightBlockBtn}>
          <Button
            className={classNames(['button-transparent'])}
            onClick={handlePreviousTab}
          >
            <ArrowLeftIcon />
            <span>Назад</span>
          </Button>
          <Button
            className={classNames(['button-primary', styles.button])}
            onClick={handleNextTab}
          >
            Продолжить
            <ArrowIcon />
          </Button>
        </div>
      </div>
      <Modal
        open={isOpenModalDeleting}
        onCancel={() => setIsOpenModalDeleting(false)}
        centered
        title="Удалить категорию?"
        footer={null}
        width={480}
      >
        <ModalDeleteCategoryProduct
          categories={aboutCategoryDeleted}
          hideModal={setIsOpenModalDeleting}
        />
      </Modal>
    </>
  );
}
