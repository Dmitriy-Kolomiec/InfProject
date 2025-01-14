import PageContent from '@/app/components/PageContent/PageContent';
import { Title } from '@/app/components/Title/Title';
import NotificationInformationRequired from '@/app/components/Notification/InformationRequired';
import { Button, Spin, Table } from 'antd';
import styles from './orderFormation.module.css';
import classNames from 'classnames';
import ArrowLeftIcon from '@/public/arrow-left.svg';
import ArrowIcon from '@/public/arrowNext.svg';
import { LoadingOutlined } from '@ant-design/icons';
import NotificationDanger from '@/app/components/Notification/Danger';
import FilterTop from './components/modals/FilterOrderFormation/FilterOrderFormation';
import { useOrderFormation } from './useOrderFormation.hook';
import { ModalsContainer } from './components/modals/ModalsContainer';
import { expandedRowRender } from './ExpandedTable';
import { useState } from 'react';
import { IOrders } from '@/interface/request/request.interface';

export default function OrderFormation() {
  const {
    dataRequest,
    loadingTableFormationData,
    expandedRows,
    isOpenModalReplacementProduct,
    setIsOpenModalReplacementProduct,
    replacementProduct,
    hideInformationRequired,
    setHideInformationRequired,
    handleExpand,
    pageAdditionalProducts,
    rowSelection,
    columns,
    handleNextTabPlacing,
    selectedProduct,
    requestId,
    setSelectedProduct,
    showOtherOffers,
    setShowOtherOffers,
    handleViewMoreClick,
    updateQuantity,
    openReplacementProductModal,
    isOpenModalProduct,
    setIsOpenModalProduct,
    isOpenModalSupplyRequest,
    setIsOpenModalSupplyRequest,
    selectedRows,
    resetSelection,
  } = useOrderFormation();
  const order = dataRequest.request?.order;

  return (
    <>
      <PageContent className={styles.container}>
        <Title tag="h2">Формирование заказа</Title>
        {!order?.length && (
          <NotificationDanger
            title="Происходит подбор позиций"
            text=" Происходит подбор позиций. Процесс может занять несколько минут.
        Пожалуйста, подождите."
          />
        )}
        {hideInformationRequired && (
          <NotificationInformationRequired
            setHideInfo={setHideInformationRequired}
          />
        )}
        <div className={styles.filter}>
          <FilterTop />
          <div className={styles.buttonWrapper}>
            <Button
              className="button-white"
              onClick={() => setIsOpenModalSupplyRequest(true)}
              disabled={!selectedRows.length}
            >
              Запрос в снабжение
            </Button>
          </div>
        </div>
        {!!order ? (
          <>
            <Spin spinning={loadingTableFormationData}>
              <Table
                className={classNames([styles.table, 'table-orderFormation'])}
                size="small"
                rowKey={record => record.id}
                columns={columns}
                dataSource={order}
                pagination={false}
                bordered
                expandable={{
                  onExpand: handleExpand,
                  expandedRowKeys: expandedRows,
                  expandedRowRender: () =>
                    expandedRowRender({
                      selectedProduct,
                      requestId,
                      setSelectedProduct,
                      showOtherOffers,
                      setShowOtherOffers,
                      handleViewMoreClick,
                      updateQuantity,
                      openReplacementProductModal,
                    }),
                  rowExpandable: record => {
                    const { optionsCount, productOffersCount } =
                      record.originalProduct;

                    return optionsCount > 1 || productOffersCount > 0;
                  },
                }}
                rowSelection={rowSelection}
                rowClassName={record =>
                  classNames({
                    activeRow: expandedRows.includes(record.id), // Применяем класс активной строки
                  })
                }
              />
            </Spin>
          </>
        ) : (
          <div className={styles.loadingBlock}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        )}
      </PageContent>
      <div className={styles.buttonFooter}>
        <Button
          className={classNames(['button-transparent', styles.buttonBack])}
          onClick={pageAdditionalProducts}
        >
          <ArrowLeftIcon />
          <span>Назад</span>
        </Button>
        <Button
          className={classNames(['button-primary', styles.button])}
          onClick={handleNextTabPlacing}
          disabled={!order?.length}
        >
          <span>Продолжить</span>
          <ArrowIcon />
        </Button>
      </div>
      <ModalsContainer
        replacementProduct={replacementProduct}
        isOpenModalReplacementProduct={isOpenModalReplacementProduct}
        setIsOpenModalReplacementProduct={setIsOpenModalReplacementProduct}
        isOpenModalProduct={isOpenModalProduct}
        setIsOpenModalProduct={setIsOpenModalProduct}
        isOpenModalSupplyRequest={isOpenModalSupplyRequest}
        setIsOpenModalSupplyRequest={setIsOpenModalSupplyRequest}
        selectedRows={selectedRows}
        resetSelection={resetSelection}
      />
    </>
  );
}
