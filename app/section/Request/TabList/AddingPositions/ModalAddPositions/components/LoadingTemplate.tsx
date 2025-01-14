import { Button, Upload, UploadProps, message } from 'antd';
import styles from './loading.module.css';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { parseCookies } from 'nookies';
import { API_SERVER_FILES } from '@/data/env';
import CloseIcon from '@/public/close.svg';
import { RequestContext } from '@/context/Request/request.context';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { downloadBlob } from '@/data/utils.common';

interface IProps {
  hideModal: Dispatch<SetStateAction<boolean>>;
}

export default function LoadingTemplate({ hideModal }: IProps) {
  const { dataRequest, setDataRequest } = useContext(RequestContext);
  const uploadFilePath = `${API_SERVER_FILES}/seller/requests/upload-template/${dataRequest.request?.id}`;
  const cookies = parseCookies();
  const accessToken = cookies['accessToken'];

  const props: UploadProps = {
    name: 'document',
    action: uploadFilePath,
    accept: '.xlsx, .xls, .csv',
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    showUploadList: {
      showDownloadIcon: false,
      showRemoveIcon: true,
      removeIcon: (
        <div className={styles.deleteIcon}>
          <CloseIcon />
        </div>
      ),
    },
    onChange(info) {
      // if (info.file.status !== 'uploading') {
      //   console.log(info.file, info.fileList);
      // }
      if (info.file.status === 'done') {
        if (info.file.response) {
          const responseData = info.file.response.xlsxData;
          setDataRequest(prevState => ({
            ...prevState,
            request: {
              ...prevState.request,
              document: responseData,
            },
          }));
          hideModal(false);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} ошибка загрузки файла`);
      }
    },
  };

  const downloadTemplate = async () => {
    try {
      const { data } = await APIRequest.get(API_ENDPOINTS.GET_TEMPLATE_XLSX, {
        responseType: 'blob',
      });
      const urlBlob = window.URL.createObjectURL(new Blob([data]));
      downloadBlob(urlBlob, 'Шаблон.xlsx');
    } catch (error) {
      message.error('Ошибка при скачивании файла');
    }
  };

  return (
    <>
      <ul className={styles.list}>
        <li>
          <h4 className={styles.title}>1. Скачайте шаблон позиций</h4>
          <Button className="button-white" onClick={downloadTemplate}>
            Скачать файл
          </Button>
        </li>
        <li>
          <h4 className={styles.title}>2. Заполните</h4>
          <span className={styles.text}>
            Заполните все поля шаблона. Не меняйте их название и расположение
            (это вызовет ошибку при загрузке).
          </span>
        </li>
        <li>
          <h4 className={styles.title}>3. Загрузите</h4>
          <Upload {...props}>
            <Button className="button-white">Загрузить шаблон</Button>
          </Upload>
        </li>
      </ul>
    </>
  );
}
