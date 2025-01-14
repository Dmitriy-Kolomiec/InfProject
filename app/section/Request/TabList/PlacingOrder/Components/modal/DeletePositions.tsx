import { Title } from '@/app/components/Title/Title';
import styles from './modal.module.css';
import { Button, notification } from 'antd';
import { Dispatch, SetStateAction, useContext } from 'react';
import { IFinishedData } from '@/interface/request/request.interface';
import { NotificationDeleteRows } from '../../../AddingPositions/TableProducts/components/delete-positions/Notification';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import axios from 'axios';
import { notify } from '@/data/utils.common';
import { RequestContext } from '@/context/Request/request.context';

interface IProps {
  requestId: number;
  hideModal: Dispatch<SetStateAction<boolean>>;
  setSelectedRowKeys: Dispatch<SetStateAction<{ [key: string]: string[] }>>;
  selectedRowKeys: { [key: string]: string[] };
  setFinishedData: Dispatch<SetStateAction<IFinishedData | undefined>>;
}

export const DeletePositions = ({
  hideModal,
  setSelectedRowKeys,
  selectedRowKeys,
  requestId,
  setFinishedData,
}: IProps) => {
  const { setDataRequest } = useContext(RequestContext);
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      message: <NotificationDeleteRows />,
      placement: 'top',
      duration: 3,
      className: styles.notification,
    });
  };

  const handleDeletePositions = async (
    products: { [key: string]: string[] },
    requestId: number,
  ) => {
    const positionIds = Object.values(products).flat();
    try {
      const requestBody = {
        orderId: requestId,
        positionIds: positionIds,
      };
      const { data } = await APIRequest.post(
        API_ENDPOINTS.DELETE_POSITION_REQUEST,
        requestBody,
      );
      if (data) {
        setFinishedData(data);
        setDataRequest(prevState => ({
          ...prevState,
          info: data.info,
        }));
        openNotification();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        notify('error', {
          message: error.message,
        });
      }
    } finally {
      hideModal(false);
      setSelectedRowKeys({});
    }
  };

  return (
    <div>
      {contextHolder}
      <Title tag="h3" className={styles.titleModal}>
        Удалить позиции?
      </Title>
      <span>Вы действительно хотите удалить выбранные позиции?</span>
      <div className={styles.buttonModal}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
          Не удалять
        </Button>
        <Button
          className="button-primary"
          onClick={() => handleDeletePositions(selectedRowKeys, requestId)}
        >
          Удалить
        </Button>
      </div>
    </div>
  );
};
