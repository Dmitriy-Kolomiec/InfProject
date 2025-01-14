import styles from './tablePartnumbers.module.css';
import { Button, Drawer, Modal, Table } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { DeletePartnumber } from '../Modal/DeletePartnumber';
import CloseIcon from '@/public/close.svg';
import DrawerEditingPartnumbers from '../Drawer/EditPartnumbers';
import { useTablePartNumbers } from './useTablePartNumbers.hook';

interface IProps {
  dataProductUpdate: () => Promise<void>;
  addCharacteristic: () => void;
}

export function TablePartnumbers({
  dataProductUpdate,
  addCharacteristic,
}: IProps): React.ReactElement {
  const {
    isOpenModalDeleting,
    setIsOpenModalDeleting,
    selectRowTable,
    openDrawer,
    form,
    editPartNumber,
    onCloseDrawer,
    editFormPartnumber,
    tableData,
    onFinishEditPartnumbers,
    handleRowClick,
    columns,
    isLoader,
    setFileIdsDescription,
  } = useTablePartNumbers({ dataProductUpdate, addCharacteristic });

  return (
    <div className={styles.container}>
      <Table
        size="small"
        showSorterTooltip={false}
        columns={columns}
        rowKey={record => record.partNumberId}
        dataSource={tableData}
        pagination={false}
        bordered
        onRow={record => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <Modal
        open={isOpenModalDeleting}
        onCancel={() => setIsOpenModalDeleting(false)}
        centered
        className={styles.modalDelete}
        title="Удалить каталожный номер?"
        footer={null}
        width={420}
      >
        <DeletePartnumber
          aboutPartNumber={selectRowTable!}
          hideModal={setIsOpenModalDeleting}
        />
      </Modal>
      <Drawer
        styles={{
          body: {
            padding: 0,
          },
        }}
        onClose={onCloseDrawer}
        open={openDrawer}
        width={480}
        closeIcon={false}
        extra={
          <Button className="button-transparent" onClick={onCloseDrawer}>
            <CloseIcon />
          </Button>
        }
        footer={
          <Button
            className={classNames(['button-primary', styles.saveButton])}
            htmlType="submit"
            onClick={editFormPartnumber}
            loading={isLoader}
          >
            Сохранить
          </Button>
        }
      >
        <DrawerEditingPartnumbers
          form={form}
          onFinish={onFinishEditPartnumbers}
          editPartNumber={editPartNumber}
          setFileIdsDescription={setFileIdsDescription}
        />
      </Drawer>
    </div>
  );
}
