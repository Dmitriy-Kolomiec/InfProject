import styles from './listOpenRelations.module.css';
import { IRelation } from '@/interface/addingProduct/connections.inteface';
import { renderHtml } from '@/data/utils.common';

interface IProps {
  relatedProduct: IRelation;
}

export default function AboutRelatedProduct({ relatedProduct }: IProps) {
  return (
    <>
      <div>
        <div className={styles.titleAboutProduct}>
          {relatedProduct.relationType}
          &nbsp;
          {relatedProduct.relationType === 'Совместимость' &&
            (relatedProduct.isFully ? '(полная)' : '(частичная)')}
        </div>

        {relatedProduct.description && (
          <div className="editor-description">
            {renderHtml(relatedProduct.description)}
          </div>
        )}
      </div>
    </>
  );
}
