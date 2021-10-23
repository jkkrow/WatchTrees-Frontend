import { useState, useCallback } from 'react';

import UploadIcon from 'assets/icons/upload.svg';
import './DragDrop.scss';

interface DragDropProps {
  type: string;
  multiple?: boolean;
  onFile: (file: File) => void;
}

const DragDrop: React.FC<DragDropProps> = ({ type, multiple, onFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isError, setIsError] = useState(false);

  const fileChangeHandler = useCallback(
    (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>): void => {
      let selectedFile: File;

      if (e.type === 'drop') {
        e = e as React.DragEvent;

        selectedFile = e.dataTransfer.files[0];
      } else {
        e = e as React.ChangeEvent<HTMLInputElement>;
        if (!e.target.files) return;

        selectedFile = e.target.files![0];
      }

      if (selectedFile.type.split('/')[0] !== type) {
        return setIsError(true);
      }

      onFile(selectedFile);
    },
    [type, onFile]
  );

  const dragInHandler = useCallback((e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const dragOutHandler = useCallback((e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  }, []);

  const dragOverHandler = useCallback((e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files) {
      setIsDragging(true);
    }
  }, []);

  const dropHandler = useCallback(
    (e: React.DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      fileChangeHandler(e);
      setIsDragging(false);
    },
    [fileChangeHandler]
  );

  return (
    <div
      className={`drag-drop${isDragging ? ' dragging' : ''}${
        isError ? ' invalid' : ''
      }`}
      onDragEnter={dragInHandler}
      onDragLeave={dragOutHandler}
      onDragOver={dragOverHandler}
      onDrop={dropHandler}
    >
      <label>
        <input
          type="file"
          hidden
          accept={`${type}/*`}
          multiple={multiple}
          onChange={fileChangeHandler}
        />
        <UploadIcon />
      </label>
      <p>Drag and Drop {type[0].toUpperCase() + type.substring(1)} File</p>
    </div>
  );
};

export default DragDrop;
