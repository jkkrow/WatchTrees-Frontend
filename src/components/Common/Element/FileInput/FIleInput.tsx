import { useEffect, useState } from 'react';

import DragDrop from 'components/Common/UI/DragDrop/DragDrop';
import Modal from 'components/Common/UI/Modal/Modal';
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import './FileInput.scss';

interface FileInfo {
  name: string;
  url: string;
}

interface FileInputProps {
  type: string;
  multiple?: boolean;
  label: string;
  initialValue?: FileInfo[];
  onFileChange: (files: File[]) => void;
}

const FileInput: React.FC<FileInputProps> = ({
  type,
  multiple,
  label,
  initialValue = [],
  onFileChange,
}) => {
  const [validFiles, setValidFiles] = useState<File[]>([]);
  const [fileInfos, setFileInfos] = useState<FileInfo[]>(initialValue);
  const [filePreview, setFilePreview] = useState<FileInfo | null>(null);

  useEffect(() => {
    if (!validFiles.length) return;

    setFileInfos(
      validFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }))
    );
  }, [validFiles]);

  const fileChangeHandler = (selectedFiles: File[]) => {
    if (!selectedFiles.length) return;

    setValidFiles((prevFiles) => {
      if (!prevFiles.length) {
        /*
         * Initial selectedFiles
         */
        onFileChange(selectedFiles);
        return selectedFiles;
      }

      if (multiple) {
        /*
         * Handler multiple file
         */
        const filesArray = [...prevFiles];
        const newFiles: File[] = [];

        selectedFiles.forEach((selectedFile) => {
          const duplicate = prevFiles.find(
            (prevFile) => selectedFile.name === prevFile.name
          );

          if (!duplicate) {
            filesArray.push(selectedFile);
            newFiles.push(selectedFile);
          }
        });

        if (newFiles.length) {
          onFileChange(newFiles);
        }

        return filesArray;
      } else {
        /*
         * Handle single file
         */
        if (prevFiles[0].name !== selectedFiles[0].name) {
          onFileChange(selectedFiles);
          return selectedFiles;
        } else {
          return prevFiles;
        }
      }
    });
  };

  return (
    <div className="file-input">
      <DragDrop
        className="file-input__dragdrop"
        type={type}
        onFile={fileChangeHandler}
        multiple={multiple}
      >
        {label}
      </DragDrop>
      <ul className="file-input__list">
        {fileInfos.map((fileInfo) => (
          <li key={fileInfo.url} className="file-input__item">
            <span
              className={type === 'image' ? ' link' : ''}
              onClick={() => setFilePreview(fileInfo)}
            >
              {fileInfo.name}
            </span>
            <RemoveIcon />
          </li>
        ))}
      </ul>
      {type === 'image' && (
        <Modal on={!!filePreview} onClose={() => setFilePreview(null)}>
          <img src={filePreview?.url} alt={filePreview?.name} />
        </Modal>
      )}
    </div>
  );
};

export default FileInput;
