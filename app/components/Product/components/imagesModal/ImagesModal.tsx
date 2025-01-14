import { IPublicFileProperty } from '@/interface/publicPart/publicPart.interface';
import styles from './imagesModal.module.css';
import { SwiperImage } from './components/SwiperImage';
import { IPropertyCategory } from '../../product.interface';

interface IProps {
  categories: IPropertyCategory[];
  nameProduct: string;
  fileId: number | undefined;
  files: IPublicFileProperty[];
}

export const ImagesModal = ({ fileId, files, categories }: IProps) => {
  return (
    <div className={styles.modal}>
      <ul className={styles.properties}>
        {!!files[0].propertyName ? (
          <>
            {files.map(file => (
              <>
                {!!file.propertyName && (
                  <li key={file.fileId} className={styles.property}>
                    {!!file.propertyName && <span>{file.propertyName}:</span>}
                    {!!file.valueName && <span> {file.valueName}</span>}
                  </li>
                )}
              </>
            ))}
          </>
        ) : (
          <>
            {categories.map(category => (
              <li key={category.id} className={styles.property}>
                {!!category.title && <span>{category.title}:</span>}
                <span>
                  {category.children.map(value => {
                    if (value.isSelected) {
                      return value.title;
                    }
                  })}
                </span>
              </li>
            ))}
          </>
        )}
      </ul>
      <div className={styles.swiper}>
        <SwiperImage fileId={fileId!} files={files} />
      </div>
    </div>
  );
};
