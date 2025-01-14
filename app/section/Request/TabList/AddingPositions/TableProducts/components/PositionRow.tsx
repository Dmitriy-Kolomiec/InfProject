// import QuantityCounter from '@/app/components/Counter/QuantityCounter';
// import { Checkbox } from 'antd';
// import Image from 'next/image';
// import styles from '../TableAddPositions.module.css';
// import React, { useState } from 'react';

// interface IProps {
//   name: string;
//   handleDelete?: any;
//   isSelected?: boolean;
// }

// export default function PositionRow({ name }: IProps): React.ReactElement {
//   const [count, setCount] = useState(1);

//   return (
//     <tr className={styles.row}>
//       <td className={styles.cell}>
//         <Checkbox />
//       </td>
//       <td className={styles.cell}>{name}</td>
//       <td className={styles.cell}>
//         <QuantityCounter
//           count={count}
//           setCount={setCount}
//         />
//       </td>
//       <td className={styles.cell}>
//         <Image
//           src="/deleteBgGray.svg"
//           width={50}
//           height={50}
//           alt="delete"
//           className={styles.image}
//         />
//       </td>
//     </tr>
//   );
// }
