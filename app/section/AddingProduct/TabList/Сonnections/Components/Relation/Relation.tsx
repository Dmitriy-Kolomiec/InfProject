import PageContent from '@/app/components/PageContent/PageContent';
import styles from './relation.module.css';
import { Button, Dropdown, Modal, Tooltip } from 'antd';
import classNames from 'classnames';
import InteractionIcon from '@/public/interaction.svg';
import Image from 'next/image';
import AnimateHeight from 'react-animate-height';
import ListOpenRelations from '../ListOpen/ListOpenRelations';
import { IConnections } from '@/interface/addingProduct/connections.inteface';
import DeleteRelation from '../Modal/DeleteRelation/DeleteRelation';
import { useRelation } from './useRelation.hook';
import { getPopupContainer } from '@/data/utils.common';

interface IProps {
  relation: IConnections;
}
export default function Relation({ relation }: IProps) {
  const {
    isListOpenRelations,
    isOpenModalDelete,
    setIsOpenModalDelete,
    toggleListRelations,
    itemsInteraction,
  } = useRelation({ relation });

  return (
    <PageContent>
      <div className={styles.relations}>
        <div className={styles.titleRelations}>
          {true && (
            <Button
              className="button-transparent"
              onClick={toggleListRelations}
            >
              <Image
                className={classNames([styles.arrowIcon], {
                  [styles.arrowIconOpen]: isListOpenRelations,
                })}
                src="/arrow-down.svg"
                width={20}
                height={20}
                alt="icon"
              />
            </Button>
          )}
          {relation.propertyValue.map(p => (
            <div
              key={p.relationPropertyValueId}
              className={styles.titleRalation}
            >
              <span>
                {p.property} {p.unit && `,${p.unit}`} / {p.value}
              </span>
            </div>
          ))}
        </div>
        <Dropdown
          getPopupContainer={getPopupContainer}
          menu={{
            items: itemsInteraction,
          }}
          trigger={['click']}
        >
          <Tooltip title="Действия" getPopupContainer={getPopupContainer}>
            <Button
              className={classNames([styles.addButton, 'button-transparent'])}
            >
              <InteractionIcon />
            </Button>
          </Tooltip>
        </Dropdown>
      </div>
      {/* TODO выпадающий список */}
      <AnimateHeight duration={300} height={isListOpenRelations ? 'auto' : 0}>
        {relation.relatedPropertyValues.map((relationProduct, index) => (
          <ListOpenRelations key={index} relationProduct={relationProduct} />
        ))}
      </AnimateHeight>
      <Modal
        open={isOpenModalDelete}
        onCancel={() => setIsOpenModalDelete(false)}
        centered
        className={styles.modalDelete}
        title="Удалить связь?"
        footer={null}
        width={600}
      >
        <DeleteRelation hideModal={setIsOpenModalDelete} relation={relation} />
      </Modal>
    </PageContent>
  );
}
