import { API_ENDPOINTS } from '@/data/api/api.data';
import APIRequest from '@/data/api/api.utils';
import { downloadBlob } from '@/data/utils.common';
import { message } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { RequestContext } from '@/context/Request/request.context';
import { IFinishedData } from '@/interface/request/request.interface';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const downloadCompetitionSheet = async (
  isDownloading: Dispatch<SetStateAction<boolean>>,
  requestId?: number,
) => {
  if (requestId) {
    isDownloading(true);
    try {
      const { data } = await APIRequest.get(
        API_ENDPOINTS.GET_REQUEST_COMPETITIVE_LIST(requestId),
        {
          responseType: 'blob',
        },
      );
      const urlBlob = window.URL.createObjectURL(new Blob([data]));
      downloadBlob(urlBlob, 'Конкурентный лист.xlsx');
    } catch (error) {
      message.error('Ошибка при скачивании файла');
    } finally {
      isDownloading(false);
    }
  }
};

export const usePlacingOrder = () => {
  const { dataRequest, setDataRequest } = useContext(RequestContext);
  const [isLoaderButton, setIsLoaderButton] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<{
    [key: string]: string[];
  }>({});
  const [finishedData, setFinishedData] = useState<IFinishedData>();
  const [deletionModalPositions, setDeletionModalPositions] =
    useState<boolean>(false);
  const disabledDeleteButton = Object.values(selectedRowKeys).every(
    arr => arr.length === 0,
  );
  const [downloadingFile, setDownloadingFile] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const router = useRouter();

  const requestId = dataRequest?.request?.id;

  useEffect(() => {
    const fetchData = async () => {
      if (requestId) {
        try {
          const { data } = await APIRequest.get(
            API_ENDPOINTS.REQUEST_FINISHED(requestId),
          );
          setFinishedData(data);
          setDataRequest(prevState => ({
            ...prevState,
            info: data.info,
          }));
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingData(false);
        }
      }
    };
    fetchData();
  }, [requestId]);

  const handleSelectChange = (sellerId: string, selectedIds: string[]) => {
    setSelectedRowKeys(prevState => ({
      ...prevState,
      [sellerId]: selectedIds,
    }));
  };
  return {
    dataRequest,
    isLoaderButton,
    setIsLoaderButton,
    selectedRowKeys,
    setSelectedRowKeys,
    finishedData,
    setFinishedData,
    deletionModalPositions,
    setDeletionModalPositions,
    disabledDeleteButton,
    downloadingFile,
    setDownloadingFile,
    isLoadingData,
    router,
    requestId,
    handleSelectChange,
  };
};
