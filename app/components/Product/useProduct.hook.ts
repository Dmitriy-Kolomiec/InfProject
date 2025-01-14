import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  INotPropertiesTree,
  IProduct,
  IPublicFileProperty,
  IPublicPartNumbers,
} from '@/interface/publicPart/publicPart.interface';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { APP_PATHS } from '@/data/paths.data';
import {
  IAboutProperty,
  IAvailableProduct,
  IPropertiesTreeNode,
  IPropertyCategory,
  IPropertyChild,
  IPublicPartNumberTree,
  PropertiesTree,
} from './product.interface';
import {
  getOnlySelectedCategories,
  getProductCategoriesFromTreeData,
} from './product.utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { useDeepCompareEffect } from 'react-use';
import axios from 'axios';
import { notify } from '@/data/utils.common';

interface IProps {
  dataProduct: IProduct;
  propertiesTree: PropertiesTree[] | INotPropertiesTree;
  partNumberIdModal?: string;
  setPartNumberIdsModal?: Dispatch<SetStateAction<number[]>>;
  modalWindow?: boolean;
}

export const useProduct = ({
  propertiesTree,
  dataProduct,
  partNumberIdModal,
  setPartNumberIdsModal,
  modalWindow,
}: IProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const partNumberQuery =
    searchParams.get('partnumber') || partNumberIdModal || undefined;
  const isAuth = useSelector((s: RootState) => s.auth.isAuth);
  const [availableProducts, setAvailableProducts] = useState<
    IAvailableProduct[]
  >([]);
  const [isOpenModalImages, setIsOpenModalImages] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number>();
  const [filesProperties, seFilesProperties] = useState<IPublicFileProperty[]>(
    [],
  );
  const [partNumbersTree, setPartNumbersTree] =
    useState<IPublicPartNumberTree[]>();
  const [aboutProperty, setAboutProperty] = useState<IAboutProperty>();
  const [isOpenModalDescription, setIsOpenModalDescription] =
    useState<boolean>(false);
  const [dataPartNumbers, setDataPartNumbers] = useState<IPublicPartNumbers>();
  const [flatCategories, setFlatCategories] = useState(() =>
    Array.isArray(propertiesTree)
      ? getProductCategoriesFromTreeData(propertiesTree[0], setPartNumbersTree)
      : [],
  );
  const [partNumbers, setPartNumbers] = useState<IPublicPartNumberTree[]>();
  const categories: IPropertyCategory[] =
    getOnlySelectedCategories(flatCategories);

  useDeepCompareEffect(() => {
    if (Array.isArray(propertiesTree) && Array.isArray(categories)) {
      // Создаем множество ключей для активных элементов
      const activeKeys = new Set(
        categories.flatMap(category =>
          category.children
            ? category.children
                .filter(child => child.isSelected)
                .map(child => child.key)
            : [],
        ),
      );

      const collectedFiles = collectFilesFromActiveBranch(
        propertiesTree,
        activeKeys,
        categories,
      );

      const filesProduct: IPublicFileProperty[] = dataProduct.files.map(
        file => {
          return {
            fileId: file.fileId,
            path: file.path,
            productName: dataProduct.product.name,
          };
        },
      );

      const files = filesProduct.concat(collectedFiles);
      seFilesProperties(files);
    }
  }, [propertiesTree, categories]);

  useEffect(() => {
    if (Array.isArray(propertiesTree)) {
      const treeArray = propertiesTree as any;
      initializeCategoriesFromPartNumber(partNumberQuery, treeArray);
    }
  }, [partNumberQuery, propertiesTree]);

  // Запрос autoModels и partNumbers для таблиц

  useDeepCompareEffect(() => {
    if (!categories || !partNumbersTree || categories.length === 0) return;

    const lastCategory = categories.at(-1);
    if (!lastCategory) return;

    let filteredPartNumbers = partNumbersTree.filter(
      part => part.parentKey === lastCategory.key,
    );

    const selectedChildrenKeys = new Set(
      lastCategory.children
        .filter(child => child.isSelected)
        .map(child => child.key),
    );

    if (selectedChildrenKeys.size > 0) {
      filteredPartNumbers = filteredPartNumbers.filter(part =>
        selectedChildrenKeys.has(part.childKey),
      );
    }

    const uniquePartNumbers = Array.from(
      new Map(filteredPartNumbers?.map(part => [part.id, part])).values(),
    );

    setPartNumbers(uniquePartNumbers);
  }, [categories, partNumbersTree]);

  useEffect(() => {
    let partNumberIds: number[] = [];
    const arrayPartNumberIds =
      partNumbers?.map(partNumber => partNumber.id) || [];

    if (setPartNumberIdsModal && modalWindow) {
      setPartNumberIdsModal(arrayPartNumberIds);
    }

    if (partNumberQuery) {
      const isPartNumberInList = arrayPartNumberIds.includes(
        Number(partNumberQuery),
      );

      if (isPartNumberInList) {
        partNumberIds = partNumberIds.concat(arrayPartNumberIds);
      }
    } else {
      partNumberIds = partNumberIds.concat(arrayPartNumberIds);
    }

    const dataStringPartNumbers = Array.isArray(propertiesTree)
      ? partNumberIds
      : propertiesTree?.partNumbers?.map(partNumber => partNumber.id);

    const dataString = JSON.stringify({
      partnumbers: dataStringPartNumbers,
    });
    const payload = encodeURIComponent(dataString);
    const fetchDataPartNumbers = async () => {
      try {
        const { data } = await APIRequest.get(
          API_ENDPOINTS.GET_PUBLIC_PARTNUMBER(payload),
        );
        setDataPartNumbers(data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.message) {
          notify('error', {
            message: error.message,
          });
        }
      }
    };
    fetchDataPartNumbers();

    if (isAuth && !modalWindow) {
      const fetchAvailableProducts = async () => {
        try {
          const { data } = await APIRequest.get(
            API_ENDPOINTS.GET_PUBLIC_AVAILABLE_PRODUCTS(payload),
          );
          setAvailableProducts(data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.message) {
            notify('error', {
              message: error.message,
            });
          }
        }
      };
      fetchAvailableProducts();
    }
  }, [dataProduct.product.id, partNumbers]);

  // Работа с файлами
  const collectFilesFromActiveBranch = (
    tree: any[],
    activeKeys: Set<number | undefined>,
    categories: IPropertyCategory[],
  ): IPublicFileProperty[] => {
    let files: IPublicFileProperty[] = [];

    for (const node of tree) {
      // Проверяем, активен ли текущий узел
      if (activeKeys.has(node.key)) {
        if (node.children) {
          node.children.map((child: any) => {
            if (!!child.files) {
              files = files.concat(
                child.files.map((file: any) => {
                  return {
                    fileId: file.fileId,
                    path: file.path,
                    partNumber: file.partNumber,
                  };
                }),
              );
            }
          });
        }
        // Если у узла есть файлы, собираем их
        if (node.files && node.files.length) {
          files = files.concat(
            node.files.map((file: any) => {
              // Находим родительский узел по parentKey
              const parentCategory = categories?.find(
                category =>
                  category.children?.some(child => child.key === node.key),
              );

              // Устанавливаем propertyName, если нашли родительский узел
              const propertyName = parentCategory
                ? parentCategory.title
                : node.title;

              return {
                fileId: file.id || file.fileId,
                path: file.path,
                propertyName: propertyName, // Название родительского узла
                valueName: node.title, // Название текущего узла
              };
            }),
          );
        }
      }

      // Если есть дети, рекурсивно собираем файлы из них
      if (node.children && node.children.length) {
        files = files.concat(
          collectFilesFromActiveBranch(node.children, activeKeys, categories),
        );
      }
    }

    return files;
  };

  // Инициализация данных
  //  Рекурсивная функция для поиска пути по дереву при partNumberQuery
  const findPathToLeaf = (
    tree: IPropertiesTreeNode[],
    targetKey: number,
  ): number[] | null => {
    for (const node of tree) {
      // Если нашли лист с нужным ключом, возвращаем массив с его ключом
      if (node.isPartNumber && node.id === targetKey) {
        return [node.key];
      }

      // Если у узла есть дети, ищем среди них
      if (node.children && node.children.length) {
        const path = findPathToLeaf(node.children, targetKey);

        // Если нашли путь, добавляем текущий узел в путь
        if (path) {
          return [node.key, ...path];
        }
      }
    }

    // Если не нашли путь, возвращаем null
    return null;
  };

  // Функция для инициализации активных элементов на основе partNumberQuery
  const initializeCategoriesFromPartNumber = (
    partNumberQuery: string | undefined,
    tree: IPropertiesTreeNode[],
  ) => {
    if (!partNumberQuery || !Array.isArray(tree)) return;

    const targetKey = parseInt(partNumberQuery, 10);

    // Ищем путь от листа к корню
    const pathToLeaf = findPathToLeaf(tree, targetKey);

    if (pathToLeaf) {
      // Обновляем flatCategories, делая активными элементы по пути
      const updatedCategories = flatCategories.map(category => {
        if (pathToLeaf.includes(category.key)) {
          return {
            ...category,
            isSelected: true,
            children: category.children.map((child: IPropertyChild) => ({
              ...child,
              isSelected: pathToLeaf.includes(child.key as number),
            })),
          };
        }
        return category;
      });

      setFlatCategories(updatedCategories);
    }
  };

  // Обработка дерева propertiesTree

  const onClickCategoryItem = (item: IPropertyChild) => {
    const { parentKey, key } = item;
    const newCategories = flatCategories.map(category => {
      if (parentKey === category.key) {
        return {
          ...category,
          children: category.children.map((item: IPropertyChild) => {
            return {
              ...item,
              isSelected: item.key === key,
            };
          }),
        };
      }

      if (partNumberQuery && !modalWindow) {
        router.replace(APP_PATHS.PUBLIC_PRODUCT(dataProduct.product.id), {
          scroll: false,
        });
      }

      return category;
    });

    setFlatCategories(newCategories);
  };

  // Modal description properties
  const openModalProperties = (value: IAboutProperty) => {
    setAboutProperty(value);
    setIsOpenModalDescription(true);
  };

  // Images
  const openImages = (fileId?: number) => {
    setSelectedImage(fileId);
    setIsOpenModalImages(true);
  };

  return {
    isOpenModalImages,
    setIsOpenModalImages,
    selectedImage,
    filesProperties,
    aboutProperty,
    isOpenModalDescription,
    setIsOpenModalDescription,
    dataPartNumbers,
    categories,
    partNumbers,
    onClickCategoryItem,
    openModalProperties,
    openImages,
    isAuth,
    availableProducts,
  };
};
