import {
  ISellersFinished,
  IProductsFinished,
  IFinishedData,
} from '@/interface/request/request.interface';
import styles from './tableSeller.module.css';
import { Button, Modal, Table, TableProps, Tooltip } from 'antd';
import Link from 'next/link';
import FootNoteIcon from '@/public/footnote.svg';
import { formatPrice, thousandsSeparator } from '@/data/utils.common';
import classNames from 'classnames';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import { AboutSeller } from './aboutSeller/AboutSeller';
import { Dispatch, SetStateAction, useState } from 'react';
import { DeletePosition } from '../modal/DeletePosition';

interface IProps {
  dataSeller: ISellersFinished;
  selectedRowKeys: string[];
  setSelectedRowKeys: (selectedKeys: string[]) => void;
  requestId: number;
  setFinishedData: Dispatch<SetStateAction<IFinishedData | undefined>>;
}

type ColumnsType<T> = TableProps<T>['columns'];

export const TableSeller = ({
  dataSeller,
  selectedRowKeys,
  setSelectedRowKeys,
  requestId,
  setFinishedData,
}: IProps) => {
  const [isOpenDeleteProduct, setisOpenDeleteProduct] =
    useState<boolean>(false);
  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys as string[]);
  };
  const [dataProductDeleted, setDataProductDeleted] = useState<{
    positionIds: string[];
    requestId: number;
    name: string;
  }>();

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const deleteProduct = (value: IProductsFinished) => {
    const { id, productName } = value.selected;
    setDataProductDeleted({
      positionIds: [id],
      requestId: requestId,
      name: productName,
    });
    setisOpenDeleteProduct(true);
  };
  const columns: ColumnsType<IProductsFinished> = [
    {
      title: '№',
      dataIndex: 'positionId',
      width: '2%',
      key: '№',
      align: 'center',
      className: styles.rowKey,
      render: (_, record) => {
        const { positionId } = record.selected;
        return <div>{positionId}</div>;
      },
    },
    {
      title: <span className={styles.titleCol}>Наименование</span>,
      dataIndex: 'name',
      key: 'name',
      width: '35%',
      render: (_, record) => {
        const { name: originalName } = record.originalProduct;
        const { productName } = record.selected;
        return (
          <>
            <div>
              <Link className={styles.nameProduct} href="/">
                {productName}
              </Link>
            </div>
            <div className={styles.neutralColor}>
              <FootNoteIcon />
              {originalName}
            </div>
          </>
        );
      },
    },
    {
      title: <span className={styles.titleCol}>Каталожный номер</span>,
      dataIndex: 'partNumber',
      key: '4',
      width: '17%',
      render: (_, record) => {
        const { partNumber } = record.selected;

        return <div>{partNumber}</div>;
      },
    },
    {
      title: <span className={styles.titleCol}>Производитель</span>,
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: '12%',
      render: (_, record) => {
        const { manufacturer } = record.selected;
        return <span className={styles.link}>{manufacturer}</span>;
      },
    },
    {
      title: <span className={styles.titleCol}>Склад</span>,
      dataIndex: 'stock',
      key: 'stock',
      width: '6%',
      className: styles.stockCell,
      render: (_, record) => {
        const { warehouseName, productAmount } = record.selected;
        return (
          <>
            <div className={styles.warehouseName}>
              <span>{warehouseName}</span>
            </div>
            <div className={styles.neutralText}>
              {!!productAmount && `${thousandsSeparator(productAmount)} шт`}
            </div>
          </>
        );
      },
    },
    {
      title: <span className={styles.titleCol}>Цена, шт</span>,
      dataIndex: 'price',
      key: 'price',
      width: '8%',
      className: styles.priceCell,
      render: (_, record) => {
        const { price, vat } = record.selected;
        return (
          <div className={styles.price}>
            <div className={styles.summ}>{formatPrice(price)} &#8381;</div>
            <div className={styles.neutralText}>
              {vat ? 'с НДС' : 'без НДС'}
            </div>
          </div>
        );
      },
    },
    {
      title: <span className={styles.titleCol}>Количество</span>,
      dataIndex: 'applicationPcs',
      key: 'applicationPcs',
      width: '9%',
      className: styles.applicationPcsCel,
      render: (_, record) => {
        const { selectedAmount } = record.selected;
        const { amount } = record.originalProduct;
        return (
          <div className={styles.applicationPcs}>
            <div>{selectedAmount}</div>
            <span className={styles.neutralText}> В заявке: {amount}</span>
          </div>
        );
      },
    },
    {
      title: <span className={styles.titleCol}>Сумма</span>,
      dataIndex: 'summ',
      key: 'summ',
      width: '11%',
      render: (_, record) => {
        const { sum } = record.selected;
        return <div className={styles.summ}>{formatPrice(sum)} &#8381;</div>;
      },
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '2%',
      className: styles.actionsCell,
      render: (_, record) => {
        const { id } = record.selected;
        return (
          <div className={styles.buttonActions}>
            <Button
              className={classNames(['button-white', styles.deleteButton])}
              onClick={() => deleteProduct(record)}
            >
              <Tooltip title="Удалить позицию">
                <DeleteIcon />
              </Tooltip>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <AboutSeller seller={dataSeller.seller} />
      <Table
        className={classNames([styles.table])}
        size="small"
        rowKey={record => record.selected.id}
        dataSource={dataSeller.products}
        columns={columns}
        pagination={false}
        bordered
        rowSelection={rowSelection}
      />
      {!!dataProductDeleted && (
        <Modal
          open={isOpenDeleteProduct}
          onCancel={() => setisOpenDeleteProduct(false)}
          centered
          className={styles.modalDelete}
          footer={null}
          width={420}
        >
          <DeletePosition
            dataProductDeleted={dataProductDeleted}
            hideModal={setisOpenDeleteProduct}
            setFinishedData={setFinishedData}
          />
        </Modal>
      )}
    </div>
  );
};
