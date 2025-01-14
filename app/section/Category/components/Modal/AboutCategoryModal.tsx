import { ITree } from '../../pages/useCategory.hook';
import styles from './modal.module.css';
import { renderHtml } from '@/data/utils.common';

interface IProps {
  aboutCategory?: ITree;
  locationTree?: ITree[];
}
export const AboutCategoryModal = ({ aboutCategory, locationTree }: IProps) => {
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.subtitle}>Расположение</div>
        {locationTree?.map(i => (
          <span key={i.id} className={styles.title}>
            {i.name}{' '}
          </span>
        ))}
      </div>
      <div>
        <div className={styles.subtitle}>Лейбл</div>
        <div className={styles.label}>{aboutCategory?.label}</div>
      </div>
      {!!aboutCategory?.description && (
        <div>
          <div className={styles.subtitle}>Описание</div>
          <div className="editor-description">
            {renderHtml(aboutCategory?.description)}
          </div>
        </div>
      )}
    </div>
  );
};
