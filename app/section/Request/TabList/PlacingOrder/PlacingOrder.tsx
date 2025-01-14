import PageContent from '@/app/components/PageContent/PageContent';
import { Title } from '@/app/components/Title/Title';
import { SummaryRequest } from './Components/summaryRequest/SummaryRequest';
import { TableSeller } from './Components/tablePlacingOrder/TableSeller';
import styles from './placingOrder.module.css';
import { Button, Modal, Spin } from 'antd';
import classNames from 'classnames';
import { DeletePositions } from './Components/modal/DeletePositions';
import ArrowLeftIcon from '@/public/arrow-left.svg';
import { onSubmitSearchAddedItems } from '../AddingPositions/useAddingPositions.hook';
import { downloadCompetitionSheet, usePlacingOrder } from './PlacingOrder.hook';
import { LoadingOutlined } from '@ant-design/icons';

export default function PlacingOrder() {
  const {
    dataRequest,
    isLoaderButton,
    setIsLoaderButton,
    selectedRowKeys,
    setSelectedRowKeys,
    finishedData,
    setFinishedData,
    deletionModalPositions,
    setDeletionModalPositions,
    disabledDeleteButton,
    downloadingFile,
    setDownloadingFile,
    isLoadingData,
    router,
    requestId,
    handleSelectChange,
  } = usePlacingOrder();

  return (
    <>
      <PageContent>
        <div>
          <div className={styles.header}>
            <Title tag="h2" className={styles.title}>
              Оформление заказа
            </Title>
            <Button
              className={classNames([
                'button-transparent',
                styles.buttonDelete,
              ])}
              disabled={disabledDeleteButton}
              onClick={() => setDeletionModalPositions(true)}
            >
              Удалить выбранные
            </Button>
          </div>
          {isLoadingData ? (
            <div className={styles.loader}>
              <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div>
          ) : (
            <>
              {!!finishedData ? (
                <>
                  {finishedData?.sellers?.map(data => (
                    <TableSeller
                      key={data.seller.id}
                      dataSeller={data}
                      selectedRowKeys={selectedRowKeys[data.seller.id] || []}
                      setSelectedRowKeys={ids =>
                        handleSelectChange(data.seller.id, ids)
                      }
                      requestId={requestId!}
                      setFinishedData={setFinishedData}
                    />
                  ))}
                </>
              ) : (
                <PageContent isCenter className={styles.noDataFinished}>
                  <Title tag="h3">Данные не найдены</Title>
                </PageContent>
              )}
            </>
          )}

          <SummaryRequest info={finishedData?.info} />
        </div>
      </PageContent>
      <div className={styles.buttonWraper}>
        <Button
          className={classNames(['button-transparent', styles.buttonBack])}
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
          <ArrowLeftIcon />
          <span>Назад</span>
        </Button>
        <Button
          className="button-primary"
          onClick={() =>
            downloadCompetitionSheet(setDownloadingFile, requestId)
          }
          loading={downloadingFile}
        >
          Скачать конкурентный лист
        </Button>
      </div>
      {!!requestId && (
        <Modal
          open={deletionModalPositions}
          onCancel={() => setDeletionModalPositions(false)}
          centered
          className={styles.modalDelete}
          title={null}
          footer={null}
          width={520}
        >
          <DeletePositions
            requestId={requestId}
            hideModal={setDeletionModalPositions}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            setFinishedData={setFinishedData}
          />
        </Modal>
      )}
    </>
  );
}
