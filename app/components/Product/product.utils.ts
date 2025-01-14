import { Dispatch, SetStateAction } from 'react';
import { IPropertyCategory, IPropertyChild } from './product.interface';

export const getProductCategoriesFromTreeData = (
  tree: any,
  setPartNumbersTree: Dispatch<
    SetStateAction<
      | {
          parentKey: number;
          id: number;
          title: string;
        }[]
      | undefined
    >
  >,
) => {
  let categories: any[] = [];

  const processProductCategories = (tree: any, parentKey?: number): void => {
    if (tree && tree.id && tree.children) {
      const parent = categories.find(item => item?.key === parentKey);
      if (parent) {
        categories = categories.map(item => {
          if (item?.key === parentKey) {
            const isAlreadyAdded = item.children?.find(
              (id: number) => id === tree.id,
            );

            if (item.children && !isAlreadyAdded) {
              item.children.push({
                id: tree.id,
                title: tree.title,
                key: tree.key,
                parentKey,
              });
            }

            if (!item.children) {
              item.children = [
                {
                  id: tree.id,
                  title: tree.title,
                  isSelected: true,
                  key: tree.key,
                  parentKey,
                },
              ];
            }
          }
          return item;
        });
      } else {
        categories.push({
          id: tree.id,
          title: tree.title,
          parentKey,
          key: tree.key,
        });
      }
    }

    if (tree?.children) {
      tree.children.forEach((child: IPropertyChild) => {
        if (child.isPartNumber) {
          setPartNumbersTree(prevState => [
            ...(prevState || []),
            {
              childKey: tree.key,
              parentKey: parentKey as number,
              id: child.id,
              title: child.title as string,
            },
          ]);
        }
        processProductCategories(child, tree.key);
      });
    }
  };

  processProductCategories(tree);

  return categories;
};

export const getOnlySelectedCategories = (categories: IPropertyCategory[]) => {
  const result: any[] = [];

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    if (!category.parentKey) {
      result.push(category);
    } else {
      const isAlreadyAdded = !!result?.find(({ id }) => id === category.id);
      if (isAlreadyAdded) continue;

      const isSelected = !!result.find(item => {
        return item.children.find(
          ({ key, isSelected }: { key: number; isSelected: boolean }) =>
            isSelected && category.parentKey === key,
        );
      });

      if (isSelected) {
        result.push(category);
      }
    }
  }

  return result;
};
