import { Button } from 'antd';
import styles from '../modal.module.css';
import { Title } from '../../../Title/Title';
import { DeleteRequestProps } from './DeleteRequest.props';
import { useContext } from 'react';
import { RequestContext } from '@/context/Request/request.context';
import axios from 'axios';
import { notify } from '@/data/utils.common';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { useRouter } from 'next/navigation';
import { APP_PATHS } from '@/data/paths.data';

export default function DeleteRequestModal({
  hideModal,
  className,
  ...props
}: DeleteRequestProps) {
  const { dataRequest, setDataRequest } = useContext(RequestContext);
  const router = useRouter();

  const handleDeleteReq = async (requestId?: number) => {
    if (requestId) {
      try {
        await APIRequest.delete(API_ENDPOINTS.DELETE_REQUEST(requestId));
        setDataRequest({});
        localStorage.removeItem('request');
        router.push(APP_PATHS.REQUESTS_LIST);
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
    <div className={className} {...props}>
      <Title tag="h3" className={styles.titleModal}>
        Вы действительно хотите удалить заявку № {dataRequest.request?.titleId}?
      </Title>
      <span>Все добавленные позиции будет удалены.</span>
      <div className={styles.buttonModal}>
        <Button className="button-transparent" onClick={() => hideModal(false)}>
          Не удалять
        </Button>
        <Button
          className="button-primary"
          onClick={() => {
            handleDeleteReq(dataRequest.request?.id);
            hideModal(false);
          }}
        >
          Удалить
        </Button>
      </div>
    </div>
  );
}
