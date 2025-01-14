import PageContent from '@/app/components/PageContent/PageContent';
import { Title } from '@/app/components/Title/Title';
import { Button, Modal, Spin } from 'antd';
import { useEffect } from 'react';
import styles from './addingPosition.module.css';
import ModalUploadingDocs from './ModalAddPositions/ModalUploadingDocs';
import TableAddPositions from './TableProducts/TableAddPositions';
import ArrowLeftIcon from '@/public/arrow-left.svg';
import classNames from 'classnames';
import ArrowIcon from '@/public/arrowNext.svg';
import DeletePositionsModal from './TableProducts/components/delete-positions/DeletePositions';
import { LoadingOutlined } from '@ant-design/icons';
import { useAddingPositions } from './useAddingPositions.hook';

export default function AddingPositions() {
  const {
    dataRequest,
    router,
    setDataRequest,
    openModal,
    setOpenModal,
    deletionModalPositions,
    setDeletionModalPositions,
    selectedRowKeys,
    setSelectedRowKeys,
    isLoadingTable,
    setIsLoading,
    addRow,
    onSubmitSearchAddedItems,
    onBack,
    isLoaderButton,
    setIsLoaderButton,
  } = useAddingPositions();

  const requestDocument = dataRequest.request?.document;

  useEffect(() => {
    if (requestDocument) {
      setDataRequest(prevState => ({
        ...prevState,
        request: {
          ...prevState.request,
          document: requestDocument,
        },
      }));
    } else {
      const initialProducts = localStorage.getItem('request');
      if (initialProducts) {
        try {
          const parsedRequest = JSON.parse(initialProducts);
          setDataRequest(prevState => ({
            ...prevState,
            request: {
              ...prevState.request,
              document: parsedRequest.document || [],
            },
          }));
        } catch (error) {
          console.error('Ошибка при парсинге request из localStorage:', error);
        }
      }
    }
    setIsLoading(false);
  }, [requestDocument]);

  return (
    <>
      <PageContent>
        <div className={styles.addPositionTitle}>
          <Title className={styles.title} tag="h2">
            Добавление позиций
          </Title>
          <div
            className={classNames([
              styles.buttonWrapper,
              styles.topPageButtons,
            ])}
          >
            {!!requestDocument?.length && (
              <>
                <Button
                  className={classNames([
                    'button-transparent',
                    styles.buttonDelete,
                  ])}
                  disabled={!selectedRowKeys.length}
                  onClick={() => setDeletionModalPositions(true)}
                >
                  Удалить выбранные
                </Button>
                <Button
                  className={classNames(['button-white', styles.button])}
                  onClick={() => setOpenModal(true)}
                >
                  Загрузить список позиций
                </Button>
              </>
            )}
          </div>
        </div>
        {isLoadingTable ? (
          <div className={styles.loader}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        ) : (
          <>
            {!!requestDocument?.length ? (
              <TableAddPositions
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
              />
            ) : (
              <div className={styles.notDataTable}>
                <Title tag="h3">Позиции не добавлены</Title>
                <div>
                  <div className={styles.text}>
                    Вы можете загрузить список позиций с помощью шаблона или
                    добавить позиции вручную.
                  </div>
                  <div className={styles.buttons}>
                    <Button
                      className="button-white"
                      onClick={() => setOpenModal(true)}
                    >
                      Загрузить список позиций
                    </Button>
                    <Button className="button-white" onClick={addRow}>
                      Добавить позицию
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {!!requestDocument?.length && (
          <div className={styles.buttonWrapper}>
            <Button
              className={classNames([
                'button-transparent',
                styles.buttonDelete,
              ])}
              onClick={() => setDeletionModalPositions(true)}
              disabled={!selectedRowKeys.length}
            >
              Удалить выбранные
            </Button>
            <Button
              className={classNames(['button-white', styles.button])}
              onClick={addRow}
              disabled={requestDocument.length > 500}
            >
              Добавить позицию
            </Button>
            <Button
              className={classNames(['button-white', styles.button])}
              onClick={() => setOpenModal(true)}
            >
              Загрузить список позиций
            </Button>
          </div>
        )}
      </PageContent>
      <div className={styles.buttonFooter}>
        <Button
          className={classNames(['button-transparent', styles.buttonBack])}
          onClick={onBack}
        >
          <ArrowLeftIcon />
          <span>Назад</span>
        </Button>
        <Button
          className={classNames(['button-primary', styles.button], {
            [styles.disabledIcon]: !requestDocument?.length,
          })}
          disabled={!requestDocument?.length}
          onClick={() =>
            onSubmitSearchAddedItems(
              dataRequest,
              setIsLoaderButton,
              router,
              dataRequest.request?.document,
            )
          }
          loading={isLoaderButton}
        >
          <span>Продолжить</span>
          <ArrowIcon />
        </Button>
      </div>
      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        centered
        footer={null}
        width={480}
      >
        <ModalUploadingDocs hideModal={setOpenModal} />
      </Modal>
      <Modal
        open={deletionModalPositions}
        onCancel={() => setDeletionModalPositions(false)}
        centered
        className={styles.modalDelete}
        title={null}
        footer={null}
        width={520}
      >
        <DeletePositionsModal
          setDeletionModalPositions={setDeletionModalPositions}
          setSelectedRowKeys={setSelectedRowKeys}
          selectedRowKeys={selectedRowKeys}
        />
      </Modal>
    </>
  );
}
