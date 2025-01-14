import styles from './treePartnumbers.module.css';
import { Button, Tree, TreeProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import PlusIcon from '@/public/plus.svg';
import classNames from 'classnames';
import Progress from '../../../../../../components/ProgressIcon/Progress';
import { DataNode } from 'antd/es/tree';
import { useContext, useEffect, useState } from 'react';
import { Key } from 'antd/es/table/interface';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { ITreeItem } from '@/interface/addingProduct/partNumbers.interface';
import { Title } from '@/app/components/Title/Title';

interface IProps {
  expandedKeys: Key[];
  setExpandedKeys: any;
  treeData: any;
  setTreeData: any;
}

export function TreePartnumbers({
  treeData,
  setTreeData,
  expandedKeys,
  setExpandedKeys,
}: IProps): React.ReactElement {
  const { dataProduct } = useContext(ProductContext);

  useEffect(() => {
    const fetchTreeData = async () => {
      const response = await APIRequest.get(
        API_ENDPOINTS.GET_TREE(dataProduct.product.id),
      );
      setTreeData(response.data.tree);
      console.log('response tree', response);
    };
    fetchTreeData();
  }, [dataProduct.product.id, setTreeData]);

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const isLastNode = (node: DataNode): boolean => {
    return !node.children || node.children.length === 0;
  };

  // Проверка корректности данных
  const isValidTreeData = (data: any): boolean => {
    return (
      Array.isArray(data) &&
      data.every(item => item && typeof item === 'object' && 'title' in item)
    );
  };

  return (
    <div className={styles.container}>
      {isValidTreeData(treeData) ? (
        <>
          <div className={styles.title}>{dataProduct.product.name}</div>
          <Tree
            titleRender={nodeData => {
              const { title, fillingProgress, isValue } = nodeData as ITreeItem;
              return (
                <div className={styles.flexContainer}>
                  <div
                    className={classNames([styles.titleRender], {
                      [styles.value]: isValue,
                    })}
                  >
                    {title ? (
                      isLastNode(nodeData) ? (
                        <Button
                          className={classNames([
                            'button-transparent',
                            styles.lastTreeNode,
                          ])}
                        >
                          {title}
                        </Button>
                      ) : (
                        <span>{title}</span>
                      )
                    ) : (
                      <span>Не указано</span>
                    )}
                  </div>
                  {fillingProgress && (
                    <div className={styles.progress}>
                      <Progress status={fillingProgress} />{' '}
                    </div>
                  )}
                </div>
              );
            }}
            showLine
            switcherIcon={<DownOutlined />}
            defaultExpandedKeys={['0-0-0']}
            onSelect={onSelect}
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={keys => setExpandedKeys(keys)}
            className="partNumber-tree"
          />
        </>
      ) : (
        <Title tag="h3">Данные для дерева не найдены</Title>
      )}
    </div>
  );
}
