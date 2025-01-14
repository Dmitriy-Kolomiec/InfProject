// import FilterTop from '@/app/components/FilterTop/FilterTop';
// import PageContent from '@/app/components/PageContent/PageContent';
// import { Title } from '@/app/components/Title/Title';
// import NotificationInformationRequired from '@/app/components/Notification/InformationRequired';
// import { Button, Form, Spin, Table, TableColumnsType, TableProps } from 'antd';
// import { useState, useContext } from 'react';
// import styles from './orderFormation.module.css';
// import classNames from 'classnames';
// import {
//   formatDate,
//   formatPrice,
//   thousandsSeparator,
// } from '@/data/utils.common';
// import CartIcon from '@/public/white-cart.svg';
// import RefreshIcon from '@/public/refresh.svg';
// import Link from 'next/link';
// import ArrowDownIcon from '@/public/arrow-down.svg';
// import ArrowUpIcon from '@/public/arrow-up.svg';
// import ArrowLeftIcon from '@/public/arrow-left.svg';
// import ArrowIcon from '@/public/arrowNext.svg';
// import { useRouter } from 'next/navigation';
// import { RequestContext } from '@/context/Request/request.context';
// import { IOrders, ISelected } from '@/interface/request/request.interface';
// import FootNoteIcon from '@/public/footnote.svg';
// import ExtarnalLinkIcon from '@/public/extarnalLink.svg';
// import NotificationWarningIcon from '@/public/notificationYellow.svg';
// import APIRequest from '@/data/api/api.utils';
// import { API_ENDPOINTS } from '@/data/api/api.data';

// type ColumnsType<T> = TableProps<T>['columns'];

// interface I

// export   const expandedRowRender = (record: IOrders) => {
//     if (!selectedProduct?.selected) return null;

//     const selectedProducts = dataRequest.request?.order?.find(
//       i => i.id === record.id,
//     )?.selected;

//     const expandedColumns: TableColumnsType<ISelected> = [
//       {
//         key: '№11',
//         align: 'center',
//         className: styles.rowKeyExp,
//       },
//       {
//         key: 'analog',
//         className: styles.tableNameColExp,
//         render: (_, record) => {
//           return (
//             <Link className={styles.nameProduct} href="/">
//               {record.productName}
//             </Link>
//           );
//         },
//       },
//       {
//         key: 'partNumber',
//         className: styles.partNumberCellExp,
//         render: (_, record) => (
//           <div className={styles.partNumber}>
//             <span>{record.partNumber}</span>
//             {/* <div className={styles.rating}>
//               <span>{record.rating}</span>
//               <StarIcon />
//             </div> */}
//           </div>
//         ),
//       },
//       {
//         key: 'manufacture',
//         className: styles.manufactureCellExp,
//         render: (_, record) => (
//           <Link href="/" className={styles.link}>
//             {record.manufacturer}
//           </Link>
//         ),
//       },
//       {
//         key: 'provider',
//         className: styles.providerCellExp,
//         render: (_, record) => (
//           <div>
//             <Link href="/" className={styles.link}>
//               {record.sellerName}
//             </Link>
//             {record.relevance && (
//               <>
//                 <div className={styles.neutralColor}>Обновление: </div>
//                 <div className={styles.neutralColor}>
//                   {formatDate({ dateString: record.relevance })}
//                 </div>
//               </>
//             )}
//           </div>
//         ),
//       },
//       {
//         key: 'stock',
//         render: (_, record) => (
//           <>
//             <div>{record.warehouseName}</div>
//             <div className={styles.neutralText}>
//               {record.productAmount
//                 ? `${thousandsSeparator(record.productAmount)} шт`
//                 : 'Под заказ'}
//             </div>
//           </>
//         ),
//         className: styles.stockCellExp,
//       },
//       {
//         key: 'price',
//         className: styles.priceCellExp,
//         render: (_, record) => {
//           return (
//             <div className={styles.price}>
//               <div className={styles.summ}>
//                 {record.price && `${formatPrice(record?.price)} &#8381`}
//               </div>
//               <div className={styles.neutralText}>
//                 {record.vat ? 'с НДС' : 'без НДС'}
//               </div>
//             </div>
//           );
//         },
//       },
//       {
//         key: 'applicationPcs',
//         className: styles.applicationPcsCelExp,
//         align: 'end',
//         render: (_, record) => (
//           <div className={styles.applicationPcs}>{record.selectedAmount}</div>
//         ),
//       },
//       {
//         key: 'xx1',
//         render: (_, record) => (
//           <div className={styles.buttonActions}>
//             <Button
//               className={classNames(['button-white', styles.refreshButton])}
//             >
//               <RefreshIcon />
//             </Button>
//             <Button
//               className={classNames(['button-primary', styles.cartButton])}
//               // onClick={() => deleteProduct(record.id)}
//             >
//               <CartIcon />В корзину
//             </Button>
//           </div>
//         ),
//       },
//     ];

//     return (
//       <>
//         <Table
//           rowKey={record => record.id}
//           columns={expandedColumns}
//           dataSource={selectedProduct?.selected}
//           pagination={false}
//           bordered
//           rowSelection={rowSelection}
//         />
//         {selectedProduct?.rows?.length > 0 && (
//           <div className={styles.tableRowsButton}>
//             <Button
//               className={classNames([
//                 styles.viewRowsTable,
//                 'button-transparent',
//                 {
//                   [styles.openTable]: showOtherOffers,
//                 },
//               ])}
//               onClick={handleViewMoreClick}
//             >
//               Смотреть другие предложения ( {selectedProduct.rows.length} )
//               <ArrowDownIcon />
//             </Button>
//           </div>
//         )}
//         {showOtherOffers && (
//           <Table
//             columns={expandedColumns}
//             dataSource={selectedProduct.rows}
//             pagination={false}
//             bordered
//           />
//         )}
//       </>
//     );
//   };
