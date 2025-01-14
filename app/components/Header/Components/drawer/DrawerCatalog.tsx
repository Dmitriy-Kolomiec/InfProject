import CatalogsPageContent from '@/app/section/Catalogs/Content';
import { API_ENDPOINTS } from '@/data/api/api.data';
import APIRequest from '@/data/api/api.utils';
import { IPublicCategory } from '@/interface/publicPart/publicPart.interface';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface IProps {
  hideDrawer: Dispatch<SetStateAction<boolean>>;
  className: string;
}

export const DrawerCatalog = ({ hideDrawer, className }: IProps) => {
  const [categories, setCategories] = useState<IPublicCategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await APIRequest.get(API_ENDPOINTS.GET_LIST_CATEGORIES);
      setCategories(data);
    };
    fetchData();
  }, []);
  return (
    <CatalogsPageContent
      categories={categories}
      hideDrawer={hideDrawer}
      className={className}
    />
  );
};
