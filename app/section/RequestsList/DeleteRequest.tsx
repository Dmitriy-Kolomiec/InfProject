import { Button } from 'antd';
import styles from './requestsList.module.css';
import { Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { notify } from '@/data/utils.common';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';

import { Title } from '@/app/components/Title/Title';
import { IListRequest } from './Content';

interface IProps {
  hideModal: Dispatch<SetStateAction<boolean>>;
  selectedRequest: { title: string; id: number };
  setDataRequests: Dispatch<SetStateAction<IListRequest[] | undefined>>;
}

export default function DeleteRequest({
  hideModal,
  selectedRequest,
  setDataRequests,
}: IProps) {
  const handleDeleteReq = async (requestId?: number) => {
    if (requestId) {
      try {
        const { data } = await APIRequest.delete(
          API_ENDPOINTS.DELETE_REQUEST(requestId),
        );
        if (data.id) {
          setDataRequests(
            prevState =>
              prevState?.filter(request => request.id !== Number(data.id)),
          );
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.message) {
          notify('error', {
            message: error.message,
          });
        }
      } finally {
        hideModal(false);
      }
    }
  };

  return (
    <>
      <Title tag="h3" className={styles.titleModal}>
        Вы действительно хотите удалить заявку № {selectedRequest.title}?
      </Title>
      <span>Все добавленные позиции будет удалены.</span>
      <div className={styles.buttonModal}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
          Не удалять
        </Button>
        <Button
          className="button-primary"
          onClick={() => {
            handleDeleteReq(selectedRequest.id);
            hideModal(false);
          }}
        >
          Удалить
        </Button>
      </div>
    </>
  );
}
