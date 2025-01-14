import React, { useEffect, useState } from 'react';
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import styles from './editor.module.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { Button, UploadFile } from 'antd';
import CloseIcon from '@/public/close.svg';
import LeafIcon from '@/public/leaf.svg';
import APIRequest from '@/data/api/api.utils';
import { API_SERVER_FILES } from '@/data/env';

interface IProps {
  onChange?: (value: string) => void;
  placeholder?: string;
  initialValue?: string;
  disabled?: boolean;
}

const EditorComponent = ({
  placeholder,
  onChange,
  initialValue,
  disabled = false,
}: IProps) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (initialValue) {
      const blocksFromHTML = convertFromHTML(initialValue);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
    }
  }, [initialValue]);

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
    onChange?.(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  // Title for blockType H3
  const editorLabels = {
    'components.controls.blocktype.h3': 'T',
  };

  const uploadCallback = (file: File) => {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('files', file);

        const response = await APIRequest.post(
          `${API_SERVER_FILES}/description-files-upload`,
          formData,
        );
        resolve({
          data: {
            link: `${API_SERVER_FILES}/files/description/${response.data[0].fileName}`,
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <div className={styles.container}>
      <Editor
        readOnly={disabled}
        placeholder={placeholder}
        toolbarClassName={styles.toolbarClassName}
        wrapperClassName={styles.wrapperClassName}
        editorClassName={styles.editorClassName}
        toolbar={{
          image: {
            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            uploadCallback: uploadCallback,
            alt: { present: false, mandatory: false, default: 'image' },
            urlEnabled: false,
            previewImage: true,
            defaultSize: {
              height: '70',
              width: '70',
            },
          },
          options: ['inline', 'blockType', 'list', 'link', 'image'],
          inline: {
            className: `${styles.inlineEditor}`,
            options: ['bold', 'italic', 'underline'],
            bold: { className: `${styles.buttonToolBar}` },
            italic: { className: `${styles.buttonToolBar}` },
            underline: { className: `${styles.buttonToolBar}` },
          },
          blockType: {
            inDropdown: false,
            options: ['H3'],
            className: `${styles.blockType}`,
          },
          list: {
            className: `${styles.listEditor}`,
            options: ['unordered', 'ordered'],
            unordered: { className: `${styles.buttonToolBar}` },
            ordered: { className: `${styles.buttonToolBar}` },
          },
          link: {
            defaultTargetOption: '_blank',
            className: `${styles.linkEditor}`,
            showOpenOptionOnHover: true,
            options: ['link'],
            link: {
              // TODO поправить иконкуА
              // icon: '../linkEditor.svg',
              className: `${styles.buttonToolBar}`,
            },
          },
        }}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        localization={{ locale: 'ru', translations: editorLabels }}
      />
      {fileList && (
        <div className={styles.test}>
          {fileList.map((file, index) => (
            <div key={index} className={styles.fileList}>
              <div className={styles.nameFile}>
                <LeafIcon />
                <span>{file.name}</span>
              </div>
              <Button
                className={styles.removeBtn}
                icon={<CloseIcon />}
                // TODO Заглушка
                onClick={() => setFileList([])}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditorComponent;
