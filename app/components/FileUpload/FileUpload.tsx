import React, { useEffect, useState } from 'react';
import styles from './fileUpload.module.css';
import { Modal, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import PlusIcon from '@/public/plus.svg';
import DeleteImageIcon from '@/public/delete-img.svg';
import { Title } from '../Title/Title';
import { UploadFileProps } from './fileUpload.props';
import { UploadFileStatus } from 'antd/es/upload/interface';
import { API_SERVER_FILES } from '@/data/env';

type FileType = File;

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

interface initialFile {
  uid: string;
  name: string;
  status?: UploadFileStatus;
  url?: string;
}

export default function FileUpload({
  title = 'Фотографии',
  setFileIds,
  initialData,
  urlPath,
  valueIndex,
  setFileIdsDescription,
}: UploadFileProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const uploadFilePath = `${API_SERVER_FILES}/files-upload`;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  useEffect(() => {
    const fetchInitialFiles = async () => {
      if (initialData && initialData.length > 0) {
        const initialFileList: initialFile[] = [];

        for (const file of initialData) {
          initialFileList.push({
            uid: file.id.toString(),
            name: file.path.substring(file.path.lastIndexOf('/') + 1),
            status: 'done',
            url: `${API_SERVER_FILES}/files/${urlPath}/${file.path}`,
          });
        }
        setFileList(initialFileList as UploadFile[]);
      }
    };

    fetchInitialFiles();
  }, [initialData, urlPath]);

  useEffect(() => {
    const formattedFileIds = fileList.map(
      (file: UploadFile) => file.response?.fileId || Number(file.uid),
    );
    {
      setFileIdsDescription && setFileIdsDescription(formattedFileIds);
    }
    {
      setFileIds &&
        setFileIds((prevState: any) => {
          return {
            ...prevState,
            [valueIndex!]: formattedFileIds,
          };
        });
    }
  }, [fileList, valueIndex, setFileIds, setFileIdsDescription]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    );
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div className={styles.uploadButton}>
      <PlusIcon />
    </div>
  );
  const props: UploadProps = {
    showUploadList: {
      showDownloadIcon: false,
      showRemoveIcon: true,
      removeIcon: (
        <div className={styles.deleteIcon}>
          <DeleteImageIcon />
        </div>
      ),
    },
  };

  return (
    <div>
      <Title className={styles.title} tag="h3">
        {title}
      </Title>
      <Upload
        {...props}
        name="files"
        multiple={true}
        method="POST"
        action={uploadFilePath}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        className={styles.upload}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        // title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        width={'50%'}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
}
