import classNames from 'classnames';
import styles from './listOpenRelations.module.css';
import { Button, Modal, Tooltip } from 'antd';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import TypeIcon from '@/public/linkEditor.svg';
import { useState } from 'react';
import { IRelatedProperty } from '@/interface/addingProduct/connections.inteface';
import DeleteRelatedProduct from './DeleteRelatedProduct';
import AboutRalationIcon from '@/public/notification.svg';
import AboutRelatedProduct from './AboutRelaterProduct';
import { getPopupContainer } from '@/data/utils.common';

interface IProps {
  relationProduct: IRelatedProperty;
}

export default function ListOpenRelations({ relationProduct }: IProps) {
  const [isOpenModalDeleteRelatedProduct, setIsOpenModalDeleteRelatedProduct] =
    useState<boolean>(false);
  const [isOpenModalAboutRelatedProduct, setIsOpenModalAboutRelatedProduct] =
    useState<boolean>(false);

  return (
    <div className={classNames(['neutral-container', styles.container])}>
      <div className={styles.title}>
        <div className={styles.name}>
          <span>{relationProduct.relatedProduct.name}</span>
        </div>
        <div className={styles.icons}>
          {relationProduct.relation.relationType === 'Совместимость' && (
            <Button
              className="button-transparent"
              onClick={() => setIsOpenModalAboutRelatedProduct(true)}
            >
              <Tooltip title="Подробнее" getPopupContainer={getPopupContainer}>
                <AboutRalationIcon />
              </Tooltip>
            </Button>
          )}
          <Button
            className="button-transparent"
            onClick={() => setIsOpenModalDeleteRelatedProduct(true)}
          >
            <DeleteIcon />
          </Button>
        </div>
      </div>
      <div className={styles.type}>
        <TypeIcon />
        <span>
          {relationProduct.relation.relationType}
          &nbsp;
          {relationProduct.relation.relationType === 'Совместимость' &&
            (relationProduct.relation.isFully ? '(полная)' : '(частичная)')}
        </span>
      </div>
      <div className={styles.relations}>
        {relationProduct.propertyValue.map((p, index) => (
          <div key={index}>
            <span>
              {p.property} {p.unit && `,${p.unit}`} {p.value && `/ ${p.value}`}
            </span>
          </div>
        ))}
      </div>
      <Modal
        open={isOpenModalDeleteRelatedProduct}
        onCancel={() => setIsOpenModalDeleteRelatedProduct(false)}
        centered
        className={styles.modalDelete}
        title="Удалить cвязанный товар?"
        footer={null}
        width={600}
      >
        <DeleteRelatedProduct
          hideModal={setIsOpenModalDeleteRelatedProduct}
          relatedProductId={relationProduct.relation.id}
        />
      </Modal>

      <Modal
        open={isOpenModalAboutRelatedProduct}
        onCancel={() => setIsOpenModalAboutRelatedProduct(false)}
        centered
        className={styles.modalDelete}
        title="Описание связи?"
        footer={null}
        width={520}
      >
        <AboutRelatedProduct relatedProduct={relationProduct.relation} />
      </Modal>
    </div>
  );
}
