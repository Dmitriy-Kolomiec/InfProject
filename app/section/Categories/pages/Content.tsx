'use client';
import PageContent from '@/app/components/PageContent/PageContent';
import { Title } from '@/app/components/Title/Title';
import React from 'react';
import styles from './categories.module.css';
import { CategoriesProps } from './categories.props';
import { Button, Drawer } from 'antd';
import CloseIcon from '@/public/close.svg';
import classNames from 'classnames';
import DrawerFilter from '../components/DrawerFilter/DrawerFilter';
import { TreeCategories } from '../components/TreeCategories/TreeCategories';
import { useCategories } from './useCategories.hook';

export default function CategoriesPageContent({
  className,
  ...props
}: CategoriesProps): React.ReactElement {
  const {
    countFilter,
    treeData,
    setTreeData,
    expandedKeysTree,
    setExpandedKeysTree,
    expandAll,
    collapseAll,
    formFilter,
    openDrawer,
    tagsDraver,
    setTagsDraver,
    isDisabledFormFilter,
    setIsDisabledFormFilter,
    onCloseDrawer,
    onOpenDrawer,
    applyFilter,
    clearFilterQuery,
    onSubmitFilter,
  } = useCategories();

  return (
    <div className={className} {...props}>
      <Title tag="h2">Категории</Title>
      <PageContent className={styles.container}>
        <div className={styles.buttonWrapper}>
          <div className={styles.flexContainer}>
            <Button className={styles.buttonFilter} onClick={onOpenDrawer}>
              Фильтр
              {!!countFilter && (
                <span className={styles.countFilter}>{countFilter}</span>
              )}
            </Button>
            {!!countFilter && (
              <Button className="button-transparent" onClick={clearFilterQuery}>
                Сбросить
              </Button>
            )}
          </div>
          {expandedKeysTree?.length === 0 ? (
            <Button className="button-transparent" onClick={expandAll}>
              Развернуть все ветки
            </Button>
          ) : (
            <Button className="button-transparent" onClick={collapseAll}>
              Свернуть все ветки
            </Button>
          )}
        </div>
        <TreeCategories
          treeData={treeData}
          setTreeData={setTreeData}
          expandedKeys={expandedKeysTree}
          setExpandedKeys={setExpandedKeysTree}
        />
      </PageContent>
      <Drawer
        styles={{
          body: {
            padding: 0,
          },
        }}
        title="Фильтры"
        onClose={onCloseDrawer}
        open={openDrawer}
        width={480}
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
            onClick={applyFilter}
            disabled={isDisabledFormFilter}
          >
            Применить
          </Button>
        }
      >
        <DrawerFilter
          form={formFilter}
          handleSubmitFilter={onSubmitFilter}
          tags={tagsDraver}
          setTags={setTagsDraver}
          setIsDisabled={setIsDisabledFormFilter}
        />
      </Drawer>
    </div>
  );
}
