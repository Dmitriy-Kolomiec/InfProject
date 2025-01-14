import { Button } from 'antd';
import styles from './modal.module.css';
import { Dispatch, SetStateAction } from 'react';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import axios from 'axios';
import { notify } from '@/data/utils.common';
import { IFinishedData } from '@/interface/request/request.interface';

interface IProps {
  hideModal: Dispatch<SetStateAction<boolean>>;
  dataProductDeleted: {
    positionIds: string[];
    requestId: number;
    name: string;
  };
  setFinishedData: Dispatch<SetStateAction<IFinishedData | undefined>>;
}

export const DeletePosition = ({
  hideModal,
  setFinishedData,
  dataProductDeleted,
}: IProps) => {
  const { positionIds, requestId } = dataProductDeleted;
  const deleteProduct = async (requestId: number, positionIds: string[]) => {
    try {
      const requestBody = {
        orderId: requestId,
        positionIds: positionIds,
      };
      const { data } = await APIRequest.post(
        API_ENDPOINTS.DELETE_POSITION_REQUEST,
        requestBody,
      );
      setFinishedData(data);
    } catch (error) {
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
    <>
      <div>Вы действительно хотите удалить выбранную позицию?</div>
      <div className={styles.buttonWrapper}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
          Не удалять
        </Button>
        <Button
          className="button-primary"
          onClick={() => deleteProduct(requestId, positionIds)}
        >
          Удалить
        </Button>
      </div>
    </>
  );
};
