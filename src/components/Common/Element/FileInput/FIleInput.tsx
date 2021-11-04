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
  label: string;
  multiple?: boolean;
  maxFile?: number;
  initialValue?: FileInfo[];
  onFileChange: (files: File[]) => void;
  onFileDelete?: (fileName: string) => void;
}

const FileInput: React.FC<FileInputProps> = ({
  type,
  multiple,
  maxFile,
  label,
  initialValue = [],
  onFileChange,
  onFileDelete,
}) => {
  const [validFiles, setValidFiles] = useState<File[]>([]);
  const [fileInfos, setFileInfos] = useState<FileInfo[]>([]);
  const [filePreview, setFilePreview] = useState<FileInfo | null>(null);

  useEffect(() => {
    !initialValue &&
      setFileInfos(
        validFiles.map((file) => ({
          name: file.name,
          url: URL.createObjectURL(file),
        }))
      );
  }, [validFiles, initialValue]);

  const fileChangeHandler = (selectedFiles: File[]) => {
    if (!selectedFiles.length) return;

    if (!validFiles.length) {
      /*
       * Initial selectedFiles
       */
      setValidFiles(selectedFiles);
      onFileChange(selectedFiles);

      return;
    }

    const newFiles: File[] = [];

    if (multiple) {
      /*
       * Handler multiple file
       */
      const filesArray = [...validFiles];

      selectedFiles.forEach((selectedFile) => {
        const duplicate = validFiles.find(
          (validFile) => selectedFile.name === validFile.name
        );

        if (!duplicate) {
          filesArray.push(selectedFile);
          newFiles.push(selectedFile);
        }
      });

      setValidFiles(filesArray);
    } else {
      /*
       * Handle single file
       */
      if (validFiles[0].name !== selectedFiles[0].name) {
        newFiles.push(selectedFiles[0]);
        setValidFiles(selectedFiles);
      }
    }

    if (newFiles.length) {
      onFileChange(newFiles);
    }
  };

  const removeFileHandler = (fileName: string) => {
    setValidFiles((prevFiles) =>
      prevFiles.filter((prevFile) => prevFile.name !== fileName)
    );

    onFileDelete && onFileDelete(fileName);
  };

  return (
    <div className="file-input">
      <DragDrop
        className="file-input__dragdrop"
        type={type}
        maxFile={maxFile}
        fileNumber={validFiles.length}
        onFile={fileChangeHandler}
        multiple={multiple}
      >
        {label}
      </DragDrop>
      <ul className="file-input__list">
        {(initialValue || fileInfos).map(
          (fileInfo) =>
            fileInfo.name && (
              <li key={fileInfo.url} className="file-input__item">
                <span
                  className={type === 'image' ? ' link' : ''}
                  onClick={() => setFilePreview(fileInfo)}
                >
                  {fileInfo.name}
                </span>
                <RemoveIcon onClick={() => removeFileHandler(fileInfo.name)} />
              </li>
            )
        )}
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
