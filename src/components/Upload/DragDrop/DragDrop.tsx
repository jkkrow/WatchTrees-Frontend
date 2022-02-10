import { useState, useCallback, forwardRef, PropsWithChildren } from 'react';

import { ReactComponent as UploadIcon } from 'assets/icons/upload.svg';
import './DragDrop.scss';

interface DragDropProps {
  className?: string;
  type: string;
  multiple?: boolean;
  maxFile?: number;
  fileNumber?: number;
  onFile: (files: File[]) => void;
}

const DragDrop = forwardRef<HTMLInputElement, PropsWithChildren<DragDropProps>>(
  (
    { className, type, multiple, maxFile, fileNumber, onFile, children },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileChangeHandler = useCallback(
      (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>): void => {
        try {
          let selectedFiles: File[];

          if (e.type === 'drop') {
            e = e as React.DragEvent;
            if (!e.dataTransfer.files) return;

            selectedFiles = [...e.dataTransfer.files];
          } else {
            e = e as React.ChangeEvent<HTMLInputElement>;
            if (!e.target.files) return;

            selectedFiles = [...e.target.files];
          }

          selectedFiles.forEach((file) => {
            if (file.type.split('/')[0] !== type) {
              throw new Error('Invalid type');
            }
          });

          if (
            (maxFile && selectedFiles.length > maxFile) ||
            (fileNumber &&
              maxFile &&
              selectedFiles.length + fileNumber > maxFile) ||
            (!multiple && selectedFiles.length > 1)
          ) {
            throw new Error('Invalid file number');
          }

          onFile(selectedFiles);
          setError(null);
        } catch (err) {
          setError((err as Error).message);
        }
      },
      [type, onFile, multiple, maxFile, fileNumber]
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
      <label
        className={`drag-drop${isDragging ? ' dragging' : ''}${
          error ? ' invalid' : ''
        }${className ? ` ${className}` : ''}`}
        onDragEnter={dragInHandler}
        onDragLeave={dragOutHandler}
        onDragOver={dragOverHandler}
        onDrop={dropHandler}
      >
        <input
          type="file"
          hidden
          accept={`${type}/*`}
          multiple={multiple}
          onChange={fileChangeHandler}
          ref={ref}
        />
        {children || (
          <div>
            <UploadIcon />
            <div>
              {error
                ? error
                : `Drag and Drop ${
                    type[0].toUpperCase() + type.substring(1)
                  } File${multiple ? 's' : ''}`}
            </div>
          </div>
        )}
      </label>
    );
  }
);

export default DragDrop;
