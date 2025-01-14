import styles from './treeCategories.module.css';
import { Key } from 'antd/es/table/interface';
import { useEffect } from 'react';
import { Button, Drawer, Modal, Tree } from 'antd';
import classNames from 'classnames';
import PlusIcon from '@/public/plus.svg';
import CloseIcon from '@/public/close.svg';
import { DownOutlined } from '@ant-design/icons';
import { DrawerAddCategory } from '../DrawerCategory/DrawerAddCategory';
import Progress from '@/app/components/ProgressIcon/Progress';
import { DrawerAddSubCategory } from '../DrawerCategory/DrawerAddSubCategory';
import { InteractiveButtons } from './components/InteractiveButtons';
import { DeleteCategory } from './components/Modal/DeleteCategory';
import { useTreeCategories } from './useTreeCategories.hook';
import { DrawerEditCategory } from '../DrawerCategory/DrawerEditCategory';
import { removeAtributeTitle } from '@/data/utils.common';
import { ITreeCategories } from '@/interface/addingProduct/connections.inteface';

interface IProps {
  expandedKeys: Key[];
  setExpandedKeys: any;
  treeData: any;
  setTreeData: any;
}

export const TreeCategories = ({
  expandedKeys,
  setExpandedKeys,
  treeData,
  setTreeData,
}: IProps) => {
  const {
    formAddCategory,
    formEditCategory,
    formSubCategory,
    autoTypeQuery,
    autoBrandQuery,
    autoModelQuery,
    isOpenDrawerAddCategory,
    isOpenDrawerAddSubCategory,
    isOpenDrawerEditCategory,
    isDisabledFormCreateCategory,
    setIsDisabledFormCreateCategory,
    isOpenModalDeleting,
    setIsOpenModalDeleting,
    selectTreeNode,
    paramsFilter,
    fetchDataTree,
    onCloseDrawer,
    openAddingCategory,
    openAddingSubCategory,
    onSubmitCreateCategory,
    onFinishSubmitCategory,
    onSubmitCreateSubCategory,
    onSubmitEditCategory,
    openEditingSubCategory,
    onFinishSubmitEditCategory,
    onSelect,
    openCategory,
    isNodeExpanded,
    toCategory,
  } = useTreeCategories({ expandedKeys, setExpandedKeys, setTreeData });

  useEffect(() => {
    fetchDataTree(paramsFilter);
  }, [autoTypeQuery, autoBrandQuery, autoModelQuery]);

  const treeDataWithTitles = removeAtributeTitle(treeData);

  return (
    <div className={styles.container}>
      {treeData && (
        <Tree
          blockNode={true}
          titleRender={(nodeData: any) => {
            const { name, count, key } = nodeData as ITreeCategories;
            const isExpanded = isNodeExpanded(key);
            return (
              <div className={styles.flexContainer}>
                <div className={styles.row}>
                  <div className={styles.titleRender}>
                    {!count && <Progress status="warning" />}
                    {name && (
                      <div
                        className={styles.title}
                        onClick={() => openCategory(nodeData)}
                      >
                        <span>{name}</span>
                        <div className={styles.count}>
                          {!!count ? count : 'Товаров нет'}
                        </div>
                      </div>
                    )}
                  </div>
                  <InteractiveButtons
                    className={styles.interactiveButtons}
                    deleteModal={setIsOpenModalDeleting}
                    addSubCategory={openAddingSubCategory}
                    editCategory={openEditingSubCategory}
                    openCategory={() => openCategory(nodeData)}
                    toCategory={toCategory}
                    isOpen={isExpanded}
                    idCategory={key}
                  />
                </div>
              </div>
            );
          }}
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={[]}
          onSelect={onSelect}
          treeData={treeDataWithTitles}
          expandedKeys={expandedKeys}
          onExpand={(keys: any) => setExpandedKeys(keys)}
          className="tree-categories"
        />
      )}
      <Button
        className={classNames(['button-transparent', styles.buttonAddCategory])}
        onClick={openAddingCategory}
      >
        <PlusIcon />
        <span>Добавить категорию</span>
      </Button>
      <Drawer
        onClose={onCloseDrawer}
        open={isOpenDrawerAddCategory}
        width={480}
        title={'Добавление категории'}
        closeIcon={false}
        extra={
          <Button className="button-transparent" onClick={onCloseDrawer}>
            <CloseIcon />
          </Button>
        }
        footer={
          <Button
            className={classNames(['button-primary', styles.buttonSave])}
            htmlType="submit"
            onClick={onSubmitCreateCategory}
            disabled={isDisabledFormCreateCategory}
          >
            Сохранить
          </Button>
        }
      >
        <DrawerAddCategory
          form={formAddCategory}
          onFinish={onFinishSubmitCategory}
          setIsDisabled={setIsDisabledFormCreateCategory}
        />
      </Drawer>
      <Drawer
        onClose={onCloseDrawer}
        open={isOpenDrawerAddSubCategory}
        width={480}
        title="Добавление подкатегории"
        closeIcon={false}
        extra={
          <Button className="button-transparent" onClick={onCloseDrawer}>
            <CloseIcon />
          </Button>
        }
        footer={
          <Button
            className={classNames(['button-primary', styles.buttonSave])}
            htmlType="submit"
            onClick={onSubmitCreateSubCategory}
            disabled={isDisabledFormCreateCategory}
          >
            Сохранить
          </Button>
        }
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <DrawerAddSubCategory
          form={formSubCategory}
          onFinish={onFinishSubmitCategory}
          setIsDisabled={setIsDisabledFormCreateCategory}
        />
      </Drawer>

      <Drawer
        onClose={onCloseDrawer}
        open={isOpenDrawerEditCategory}
        width={480}
        title="Редактирование категории"
        closeIcon={false}
        extra={
          <Button className="button-transparent" onClick={onCloseDrawer}>
            <CloseIcon />
          </Button>
        }
        footer={
          <Button
            className={classNames(['button-primary', styles.buttonSave])}
            htmlType="submit"
            onClick={onSubmitEditCategory}
            disabled={isDisabledFormCreateCategory}
          >
            Сохранить
          </Button>
        }
      >
        <DrawerEditCategory
          form={formEditCategory}
          onFinish={onFinishSubmitEditCategory}
          setIsDisabled={setIsDisabledFormCreateCategory}
          name={selectTreeNode?.name}
          label={selectTreeNode?.label}
          description={selectTreeNode?.description}
        />
      </Drawer>
      <Modal
        open={isOpenModalDeleting}
        onCancel={() => setIsOpenModalDeleting(false)}
        centered
        title="Удалить категорию?"
        footer={null}
        width={480}
      >
        <DeleteCategory
          category={selectTreeNode!}
          hideModal={setIsOpenModalDeleting}
          fetchDataTree={fetchDataTree}
          paramsFilter={paramsFilter}
        />
      </Modal>
    </div>
  );
};
