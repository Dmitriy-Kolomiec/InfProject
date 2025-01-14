import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { ICategories } from '@/interface/addingProduct/options.interface';
import { IShouldShow } from '@/interface/addingProduct/product.interface';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useContext, useState } from 'react';

export const closeWindowOptions = (
  name: keyof IShouldShow,
  setShouldShowComponent: React.Dispatch<React.SetStateAction<IShouldShow>>,
) => {
  setShouldShowComponent(() => {
    const newState: IShouldShow = {
      showAddingCategory: false,
      showEditCategory: false,
      showAddingProperties: false,
      showEditProperties: false,
      showAddingVehicle: false,
      showEditVehicle: false,
      showAddingRelations: false,
      showEditRelations: false,
    };

    newState[name] = true;
    return newState;
  });
};

export const useOptions = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dataProduct } = useContext(ProductContext);
  const [isOpenModalDeleting, setIsOpenModalDeleting] =
    useState<boolean>(false);
  const [aboutCategoryDeleted, setAboutCategoryDeleted] =
    useState<ICategories>();

  // Category
  const deleteCategory = (categories: ICategories) => {
    setAboutCategoryDeleted(categories);
    setIsOpenModalDeleting(true);
  };

  // Добавление query params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const handleNextTab = () => {
    router.push(pathname + '?' + createQueryString('tab', 'partnumbers'));
  };
  const handlePreviousTab = () => {
    router.push(pathname + '?' + createQueryString('tab', 'description'));
  };

  return {
    pathname,
    router,
    searchParams,
    dataProduct,
    isOpenModalDeleting,
    setIsOpenModalDeleting,
    aboutCategoryDeleted,
    deleteCategory,
    handleNextTab,
    handlePreviousTab,
  };
};
