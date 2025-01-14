import styles from './listOpenCharacteristic.module.css';
import { renderHtml } from '@/data/utils.common';

interface IProps {
  property: string;
  valueCharacteristic?: string;
  description: string;
}

export const ModalViewingCharacteristic = ({
  property,
  valueCharacteristic,
  description,
}: IProps) => {
  return (
    <div>
      <div className={styles.titleCharacteristic}>
        <div className={styles.valueList}>
          {property} / {valueCharacteristic}
        </div>
      </div>
      <div className="editor-description">{renderHtml(description)}</div>
    </div>
  );
};
