import { Button, notification } from 'antd';
import styles from './deletePositions.module.css';
import { Title } from '../../../../../../../components/Title/Title';
import { DeletePositionsProps } from './DeletePositions.props';
import { IProductList } from '@/interface/request/request.interface';
import { NotificationDeleteRows } from './Notification';
import { useContext } from 'react';
import { RequestContext } from '@/context/Request/request.context';

export default function DeletePositionsModal({
  setDeletionModalPositions: setDeletionPosModalVisible,
  setSelectedRowKeys,
  selectedRowKeys,
  className,
  ...props
}: DeletePositionsProps) {
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

  const handleDeletePositions = (products: IProductList[]) => {
    // Извлекаем текущие данные из localStorage
    const existingProducts = localStorage.getItem('request');
    let parsedRequest: { document: IProductList[] } | null = null;

    if (existingProducts) {
      try {
        parsedRequest = JSON.parse(existingProducts);
      } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
        parsedRequest = { document: [] };
      }
    } else {
      parsedRequest = { document: [] };
    }

    if (parsedRequest && parsedRequest.document) {
      const updatedDocument = parsedRequest.document.filter(
        (product: IProductList) =>
          !products.some(item => item.id === product.id),
      );
      parsedRequest.document = updatedDocument;

      localStorage.setItem('request', JSON.stringify(parsedRequest));

      // Обновляем состояние dataRequest
      setDataRequest(prevRequest => {
        if (
          prevRequest &&
          prevRequest.request &&
          prevRequest.request.document
        ) {
          return {
            ...prevRequest,
            request: {
              ...prevRequest.request,
              document: prevRequest.request.document.filter(
                product => !products.some(item => item.id === product.id),
              ),
            },
          };
        }
        return prevRequest;
      });

      openNotification();
      setSelectedRowKeys([]);
      setDeletionPosModalVisible(false);
    }
  };

  return (
    <div className={className} {...props}>
      {contextHolder}
      <Title tag="h3" className={styles.titleModal}>
        Удалить позиции?
      </Title>
      <span>Вы действительно хотите удалить выбранные позиции?</span>
      <div className={styles.buttonModal}>
        <Button
          className="button-transparent"
          onClick={() => setDeletionPosModalVisible(false)}
        >
          Не удалять
        </Button>
        <Button
          className="button-primary"
          onClick={() => handleDeletePositions(selectedRowKeys)}
        >
          Удалить
        </Button>
      </div>
    </div>
  );
}
