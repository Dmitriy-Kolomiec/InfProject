import { getPlurals } from '@/data/utils.common';
import styles from './images.module.css';
import { Button } from 'antd';
import { API_SERVER_FILES } from '@/data/env';
import Image from 'next/image';
import DefaultImage from '@/public/defaultImage.svg';
import classNames from 'classnames';
import { IPublicPartNumberTree, PropertiesTree } from '../../product.interface';
import {
  INotPropertiesTree,
  IProduct,
  IPublicFileProperty,
} from '@/interface/publicPart/publicPart.interface';

interface IProps {
  dataProduct: IProduct;
  propertiesTree: PropertiesTree[] | INotPropertiesTree;
  filesProperties: IPublicFileProperty[];
  partNumbers: IPublicPartNumberTree[] | undefined;
  openImages: (fileId?: number | undefined) => void;
}

export const ImagesContent = ({
  dataProduct,
  propertiesTree,
  filesProperties,
  partNumbers,
  openImages,
}: IProps) => {
  const firstFile = dataProduct.files[0];
  const files = dataProduct.files;
  const filesLength = dataProduct.files.length;

  return (
    <div className={styles.img}>
      <div>
        <div className={styles.mainImg}>
          {!!filesProperties?.[0] ? (
            <Image
              src={`${API_SERVER_FILES}/files${filesProperties[0].path}`}
              width="320"
              height="320"
              alt="image"
              priority
              itemProp="image"
              onClick={() => openImages(firstFile?.fileId)}
            />
          ) : (
            <>
              {!!filesLength ? (
                <>
                  <Image
                    src={`${API_SERVER_FILES}/files${firstFile.path}`}
                    width="320"
                    height="320"
                    alt="image"
                    priority
                    itemProp="image"
                    onClick={() => openImages(firstFile.fileId)}
                  />
                </>
              ) : (
                <DefaultImage />
              )}
            </>
          )}
        </div>
        {filesProperties?.length > 1 ? (
          <div className={styles.images}>
            <div className={styles.prevImage}>
              {filesProperties.slice(1, 5).map(file => (
                <Image
                  key={file.fileId}
                  src={`${API_SERVER_FILES}/files${file.path}`}
                  width="72"
                  height="72"
                  alt="image"
                  itemProp="image"
                  priority
                  className={styles.image}
                  onClick={() => openImages(file.fileId)}
                />
              ))}
            </div>
            {filesLength > 5 && (
              <Button
                className={classNames([
                  'button-transparent',
                  styles.openImagesButton,
                ])}
                onClick={() => openImages()}
              >
                Ещё {filesProperties.length - 5} {''}
                {getPlurals(
                  filesProperties.length,
                  'изображениe',
                  'изображения',
                  'изображений',
                )}
              </Button>
            )}
          </div>
        ) : (
          <>
            {filesLength > 1 && (
              <div className={styles.images}>
                <div className={styles.prevImage}>
                  {files.slice(1).map(file => (
                    <Image
                      key={file.fileId}
                      src={`${API_SERVER_FILES}/files${file.path}`}
                      width="72"
                      height="72"
                      alt="image"
                      itemProp="image"
                      priority
                      className={styles.image}
                      onClick={() => openImages(file.fileId)}
                    />
                  ))}
                </div>
                {filesLength > 5 && (
                  <Button
                    className={classNames([
                      'button-transparent',
                      styles.openImagesButton,
                    ])}
                    onClick={() => openImages()}
                  >
                    Ещё {filesLength - 5}
                    {''}
                    {getPlurals(
                      filesLength,
                      'изображениe',
                      'изображения',
                      'изображений',
                    )}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {Array.isArray(propertiesTree) && !!partNumbers?.length && (
        <div className={styles.partNumbers}>
          <span className={styles.partNumberTitle}>
            {getPlurals(
              partNumbers.length,
              'Каталожный номер',
              'Каталожныe номера',
              'Каталожныe номера',
            )}
          </span>
          <ul className={styles.ListPartNumbers}>
            {partNumbers.map(partNumber => (
              <li
                key={partNumber.id}
                className={styles.partNumber}
                itemProp="mpn"
              >
                {partNumber.title};
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
