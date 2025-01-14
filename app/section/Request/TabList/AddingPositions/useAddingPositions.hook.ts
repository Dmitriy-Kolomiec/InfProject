import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IAboutRequest,
  IProductList,
} from '@/interface/request/request.interface';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { RequestContext } from '@/context/Request/request.context';
import axios from 'axios';
import { notify } from '@/data/utils.common';
import { APP_PATHS } from '@/data/paths.data';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const useAddingPositions = () => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [deletionModalPositions, setDeletionModalPositions] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<IProductList[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(true);
  const [isLoaderButton, setIsLoaderButton] = useState<boolean>(false);
  const { dataRequest, setDataRequest } = useContext(RequestContext);

  const addRow = () => {
    setDataRequest(prevRequest => {
      const document = prevRequest.request?.document;
      const lastRowKey = document?.length ? document.at(-1)?.id ?? 0 : 0;

      if (prevRequest && prevRequest.request && document) {
        const newRow = {
          name: '',
          partNumbers: [],
          amount: 1,
          id: lastRowKey + 1,
        };
        return {
          ...prevRequest,
          request: {
            ...prevRequest.request,
            document: [...document, newRow],
          },
        };
      }

      return prevRequest;
    });
  };

  const onBack = () => {
    if (dataRequest.request?.id) {
      router.push(
        APP_PATHS.REQUESTS_VIEW(dataRequest.request?.id) +
          '?' +
          new URLSearchParams({
            tab: 'recipientInfo',
          }).toString(),
      );
    }
  };

  return {
    dataRequest,
    setDataRequest,
    router,
    openModal,
    setOpenModal,
    deletionModalPositions,
    setDeletionModalPositions,
    selectedRowKeys,
    setSelectedRowKeys,
    isLoadingTable,
    setIsLoading: setIsLoadingTable,
    addRow,
    onSubmitSearchAddedItems,
    onBack,
    isLoaderButton,
    setIsLoaderButton,
  };
};

export const onSubmitSearchAddedItems = async (
  dataRequest: IAboutRequest,
  setIsLoaderButton: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance,
  document?: IProductList[],
) => {
  setIsLoaderButton(true);
  const requestBody = {
    id: dataRequest.request?.id,
    document: document,
  };

  try {
    await APIRequest.post(API_ENDPOINTS.SEARCH_REQUEST, requestBody);
    if (dataRequest?.request?.id) {
      localStorage.removeItem('request');
      router.push(
        APP_PATHS.REQUESTS_VIEW(dataRequest.request.id) +
          '?' +
          new URLSearchParams({
            tab: 'formation',
          }).toString(),
      );
    }
  } catch (error) {
    console.log('Ошибка при формировании документа order:', error);
    if (axios.isAxiosError(error) && error.message) {
      notify('error', {
        message: error.message,
      });
    }
  } finally {
    setIsLoaderButton(false);
  }
};
