import styles from './users.module.css';
import { Button, CheckboxProps, TableProps, Tag, Tooltip } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import EditIcon from '@/public/editIcon.svg';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import InToAccountIcon from '@/public/inToAccount.svg';
import { formatPhone } from '@/data/utils.common';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { getProfileUser, loginDifferentUser } from '@/store/slice/authSlice';
import { APP_PATHS } from '@/data/paths.data';
import { useRouter } from 'next/navigation';
import { IUser } from '@/interface/user/user.interface';

type ColumnsType<T> = TableProps<T>['columns'];

export const useHandlers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const [isOpenModalAddUser, setIsOpenModalAddUser] = useState<boolean>(false);
  const [isOpenModalEditUser, setIsOpenModalEditUser] =
    useState<boolean>(false);
  const [isOpenModalDeletingUser, setIsOpenModalDeletingUser] =
    useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Checkbox.Group
  const [checkedList, setCheckedList] = useState<string[]>([]);

  const plainOptions: { label: string; value: string }[] = [
    { label: 'Менеджер', value: 'manager' },
    { label: 'Модераторы', value: 'moderator' },
    { label: 'Администраторы', value: 'admin' },
  ];
  const checkAll = plainOptions.length === checkedList.length;

  const onCheckAllChange: CheckboxProps['onChange'] = e => {
    setCheckedList(
      e.target.checked ? plainOptions.map(item => item.value) : [],
    );
  };

  const onChangeCheckboxGroup = (list: any) => {
    setCheckedList(list);
  };

  // Delete user
  const deletingUser = (user: IUser) => {
    setSelectedUser(user);
    setIsOpenModalDeletingUser(true);
  };
  // Editing user
  const editingUser = (user: IUser) => {
    setSelectedUser(user);
    setIsOpenModalEditUser(true);
  };

  // login to account
  const loginToAccount = async (id: string) => {
    try {
      const actionResult = await dispatch(loginDifferentUser({ id }));
      if (loginDifferentUser.fulfilled.match(actionResult)) {
        const initUser = await dispatch(getProfileUser());

        if (initUser.meta.requestStatus === 'fulfilled') {
          const userRole = (initUser.payload as IUser).roles;
          if (userRole.find(item => item.title === 'manager')) {
            router.push(APP_PATHS.REQUESTS_LIST);
          } else {
            router.push(APP_PATHS.ADMIN);
          }
        }
      }
    } catch (error: any) {
      console.error('Ошибка:', error);
    }
  };

  // // Table
  const columns: ColumnsType<IUser> = [
    {
      title: 'ФИО',
      dataIndex: 'name',
      key: '1',
      width: '30%',
      render: (_, record) => {
        const { lastName, firstName } = record;

        const name = lastName ? `${lastName} ${firstName}` : firstName;
        return <div>{name}</div>;
      },
    },
    {
      title: 'Роль',
      dataIndex: 'roles',
      key: '2',
      render: (tags: { name: string; title: string }[]) => (
        <div>
          {tags.map(tag => {
            let color = 'warning';
            if (tag.title === 'admin') {
              color = '#FFE8E7';
            }
            if (tag.title === 'moderator') {
              color = 'blue';
            }

            return (
              <Tag
                className={classNames([styles.tag], {
                  [styles.tagAdmin]: tag.title === 'admin',
                  [styles.tagModerator]: tag.title === 'moderator',
                  [styles.tagSeller]: tag.title === 'manager',
                })}
                color={color}
                key={tag.title}
              >
                {tag.name.toUpperCase()}
              </Tag>
            );
          })}
        </div>
      ),
      width: '30%',
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: '3',
      width: '30%',
      render: phone => {
        return <span>{formatPhone(phone)}</span>;
      },
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '10%',
      render: record => (
        <div className={styles.buttonActions}>
          <Tooltip title="Войти в аккаунт">
            <Button onClick={() => loginToAccount(record.userId)}>
              <InToAccountIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button onClick={() => editingUser(record)}>
              <EditIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Удалить">
            <Button onClick={() => deletingUser(record)}>
              <DeleteIcon />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleChangeSelect = (value: string) => {
    setPage(1);
    setPageSize(Number(value));
  };

  const onChangePagination = (value: number) => {
    setPage(value);
  };

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Фильтрация данных
  const filteredUsers =
    checkedList.length > 0
      ? users.filter(user =>
          user.roles.some(role => checkedList.includes(role.title)),
        )
      : users;

  // Постраничное отображение данных
  const paginatedData = filteredUsers.slice(startIndex, endIndex);

  return {
    users,
    setUsers,
    isOpenModalAddUser,
    setIsOpenModalAddUser,
    checkedList,
    setCheckedList,
    plainOptions,
    checkAll,
    onCheckAllChange,
    onChangeCheckboxGroup,
    columns,
    isOpenModalDeletingUser,
    setIsOpenModalDeletingUser,
    selectedUser,
    isOpenModalEditUser,
    setIsOpenModalEditUser,
    page,
    pageSize,
    handleChangeSelect,
    onChangePagination,
    paginatedData,
  };
};
