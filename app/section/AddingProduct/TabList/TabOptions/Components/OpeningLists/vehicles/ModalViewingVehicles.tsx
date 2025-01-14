import { renderHtml } from '@/data/utils.common';
import styles from './listOpenVehicles.module.css';

interface IProps {
  autoBrand: string;
  autoType: string;
  autoModel: string;
}

export const ModalViewingVehicles = ({
  autoBrand,
  autoType,
  autoModel,
}: IProps) => {
  return (
    <div className={styles.titleCharacteristic}>
      <div>
        <div className={styles.subtitle}>Транспортное средство</div>
        <div className={styles.title}>
          {autoType} / {autoBrand} / {autoModel}
        </div>
      </div>
      {/* {amount && (
        <div>
          <div className={styles.subtitle}>
            Количество деталей на транспортном средстве
          </div>
          <div>{amount}</div>
        </div>
      )}
      {identifyMethod && (
        <div className={styles.description}>
          <div className={styles.subtitle}>Метод идентификации</div>
          <div className="editor-description">{renderHtml(identifyMethod)}</div>
        </div>
      )}
      {externalScheme && (
        <a href={externalScheme} target="_blank" className={styles.link}>
          Ссылка на внешнюю схему
        </a>
      )} */}
    </div>
  );
};
