import { ProductContext } from '@/context/AddProduct/addProduct.context';
import {
  IConnections,
  IPropertyConnection,
} from '@/interface/addingProduct/connections.inteface';
import { Button } from 'antd';
import classNames from 'classnames';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useContext, useState } from 'react';
import styles from './relation.module.css';

type ItemType = { key: string; label: JSX.Element; action: string };

interface IProps {
  relation: IConnections;
}

export const useRelation = ({ relation }: IProps) => {
  const [isListOpenRelations, setIsListOpenRelations] =
    useState<boolean>(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);
  const { setShouldShowComponent } = useContext(ProductContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const openEditRelations = (property: IPropertyConnection[]) => {
    const relationIds = property.map(p => p.propertyValueId);
    router.push(
      pathname + '?' + createQueryString('relationEdit', `${relationIds}`),
    );
    setShouldShowComponent(state => ({
      ...state,
      showEditRelations: true,
    }));
  };

  const toggleListRelations = () => {
    setIsListOpenRelations(!isListOpenRelations);
  };
  const itemsInteraction: ItemType[] = [
    {
      key: '1',
      label: (
        <Button
          className="button-transparent"
          onClick={() => openEditRelations(relation.propertyValue)}
        >
          Редактировать
        </Button>
      ),
      action: 'Редактировать',
    },
    {
      key: '2',
      label: (
        <Button
          onClick={() => setIsOpenModalDelete(true)}
          className={classNames(['button-transparent', styles.buttonDropdown])}
        >
          Удалить
        </Button>
      ),
      action: 'Удалить',
    },
  ];
  return {
    isListOpenRelations,
    isOpenModalDelete,
    setIsOpenModalDelete,
    toggleListRelations,
    itemsInteraction,
  };
};
