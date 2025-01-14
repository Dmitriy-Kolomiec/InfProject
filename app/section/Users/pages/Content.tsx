'use client';
import styles from './users.module.css';
import { Button, Checkbox, Table, Modal } from 'antd';
import PlusIcon from '@/public/plus.svg';
import classNames from 'classnames';
import AddUserModal from '../components/Modal/InteractionsUser/AddUser';
import { useHandlers } from './handlers';
import DeletingUser from '../components/Modal/DeletingUser/DeletingUser';
import EditUserModal from '../components/Modal/InteractionsUser/EditUser';
import { Title } from '@/app/components/Title/Title';
import PageContent from '@/app/components/PageContent/PageContent';
import { useEffect } from 'react';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { CustomPagination } from '@/app/components/Pagination/Pagination';
import { IUser } from '@/interface/user/user.interface';

export default function UsersPageContent() {
  const {
    users,
    setUsers,
    isOpenModalAddUser,
    setIsOpenModalAddUser,
    checkedList,
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
  } = useHandlers();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await APIRequest.get(API_ENDPOINTS.GET_USERS);
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <>
      <Title tag="h2">Пользователи системы</Title>
      <PageContent>
        <div className={styles.filterTop}>
          <div>
            <Checkbox onChange={onCheckAllChange} checked={checkAll}>
              Все
            </Checkbox>
            <Checkbox.Group
              options={plainOptions}
              value={checkedList}
              onChange={onChangeCheckboxGroup}
            />
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              className={classNames(['button-white', styles.addButton])}
              onClick={() => setIsOpenModalAddUser(true)}
            >
              <PlusIcon />
              Добавить пользователя
            </Button>
          </div>
        </div>
        <Table
          size="middle"
          showSorterTooltip={false}
          columns={columns}
          rowKey={record => record.userId}
          dataSource={paginatedData}
          pagination={false}
          bordered
        />
        {users.length > 10 && (
          <CustomPagination<IUser>
            data={users}
            page={page}
            pageSize={pageSize}
            onChange={onChangePagination}
            onChangeSelect={handleChangeSelect}
          />
        )}
      </PageContent>
      <Modal
        open={isOpenModalAddUser}
        onCancel={() => setIsOpenModalAddUser(false)}
        centered
        title={'Добавление пользователя'}
        footer={null}
        width={480}
      >
        <AddUserModal hideModal={setIsOpenModalAddUser} setUsers={setUsers} />
      </Modal>
      {!!selectedUser && (
        <>
          <Modal
            open={isOpenModalEditUser}
            onCancel={() => setIsOpenModalEditUser(false)}
            centered
            title={'Редактирование пользователя'}
            footer={null}
            width={480}
          >
            <EditUserModal
              user={selectedUser}
              setUsers={setUsers}
              hideModal={setIsOpenModalEditUser}
            />
          </Modal>
          <Modal
            open={isOpenModalDeletingUser}
            onCancel={() => setIsOpenModalDeletingUser(false)}
            centered
            title={'Удалить пользователя?'}
            footer={null}
            width={480}
          >
            <DeletingUser
              user={selectedUser}
              hideModal={setIsOpenModalDeletingUser}
              setUsers={setUsers}
            />
          </Modal>
        </>
      )}
    </>
  );
}
