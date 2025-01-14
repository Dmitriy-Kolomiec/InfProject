import { Button } from 'antd';
import styles from './deletingUser.module.css';
import { Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { notify } from '@/data/utils.common';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { IUser } from '@/interface/user/user.interface';

interface IProps {
  user: IUser;
  setUsers: Dispatch<SetStateAction<IUser[]>>;
  hideModal: Dispatch<SetStateAction<boolean>>;
}
export default function DeletingUser({ user, setUsers, hideModal }: IProps) {
  const { lastName, firstName, userId, roles } = user;
  const name = lastName ? `${lastName} ${firstName}` : firstName;

  const deleteUser = async (userId: string) => {
    try {
      const { data } = await APIRequest.delete(
        API_ENDPOINTS.DELETE_USER(userId),
      );
      setUsers(prevState =>
        prevState.filter(item => item.userId !== data.userId),
      );
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      if (axios.isAxiosError(error) && error.message) {
        notify('error', {
          message: error.message,
        });
      }
    } finally {
      hideModal(false);
    }
  };

  return (
    <div className={styles.deleteModal}>
      <span className={styles.title}>
        Вы действительно хотите удалить пользователя: <br />
        {name}?
      </span>
      <br />
      <span>Роли пользователя:</span>
      <ul className={styles.listRoles}>
        {roles?.map((item: any, index: any) => {
          let role = 'Менеджер';
          if (item === 'admin') {
            role = 'Администратор';
          }
          if (item === 'moderator') {
            role = 'Модератор';
          }
          return <li key={index}>{role}</li>;
        })}
      </ul>
      <div className={styles.buttonWrapper}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
          Не удалять
        </Button>
        <Button className="button-primary" onClick={() => deleteUser(userId)}>
          Удалить
        </Button>
      </div>
    </div>
  );
}
