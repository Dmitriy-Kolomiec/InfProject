import styles from './treeRelations.module.css';
import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useTreeCategories } from './useTreeRelations.hook';
import { Title } from '@/app/components/Title/Title';
import { Skelet } from '@/app/components/Skeleton/Skeleton';
import { removeAtributeTitle } from '@/data/utils.common';
import { ITreeCategories } from '@/interface/addingProduct/connections.inteface';

interface IProps {
  treeData: any;
  fetchDataProducts: (id: number) => Promise<void>;
}

export const TreeRelations = ({ treeData, fetchDataProducts }: IProps) => {
  const { onClick } = useTreeCategories({ fetchDataProducts });

  const treeDataWithTitles = removeAtributeTitle(treeData);

  return (
    <div className={styles.container}>
      <Title tag="h3" className={styles.titleTree}>
        Выберите категорию
      </Title>
      {treeData ? (
        <Tree
          blockNode={true}
          titleRender={(nodeData: any) => {
            const { name, count, key } = nodeData as ITreeCategories;
            return (
              <div className={styles.flexContainer}>
                <div className={styles.row}>
                  <div className={styles.titleRender}>
                    {name && (
                      <div className={styles.title}>
                        <span>{name}</span>
                        <div className={styles.count}>
                          {!!count ? <>({count})</> : 'Товаров нет'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }}
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={[]}
          onClick={onClick}
          treeData={treeDataWithTitles}
          className="tree-categories"
        />
      ) : (
        <Skelet renderCount={11} />
      )}
    </div>
  );
};
