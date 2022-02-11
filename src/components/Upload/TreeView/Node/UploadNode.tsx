import Content from './Body/Content';
import Controls from './Body/Controls';
import Error from './Body/Error';
import DragDrop from 'components/Upload/DragDrop/DragDrop';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { VideoNode } from 'store/slices/video-slice';
import { uploadVideo } from 'store/thunks/upload-thunk';
import './UploadNode.scss';

interface UploadNodeProps {
  currentNode: VideoNode;
  rootId: string;
}

const UploadNode: React.FC<UploadNodeProps> = ({ currentNode, rootId }) => {
  const activeNodeId = useAppSelector((state) => state.upload.activeNodeId);
  const dispatch = useAppDispatch();

  const fileChangeHandler = (files: File[]): void => {
    dispatch(uploadVideo(files[0], currentNode.id));
  };

  return (
    <div
      className={`upload-node${
        currentNode.id === activeNodeId ? ' active' : ''
      }`}
    >
      {(currentNode.id === activeNodeId ||
        currentNode.prevId === activeNodeId) && (
        <div
          className={`upload-node__body${
            currentNode.layer % 2 === 0 ? ' layer-even' : ' layer-odd'
          }`}
        >
          <Controls currentNode={currentNode} rootId={rootId} />
          {currentNode.info ? (
            <>
              <Content currentNode={currentNode} rootId={rootId} />
              <Error currentNode={currentNode} error={currentNode.info.error} />
            </>
          ) : (
            <DragDrop type="video" onFile={fileChangeHandler} />
          )}
        </div>
      )}

      <div className="upload-node__children">
        {currentNode.children.map((item) => (
          <UploadNode key={item.id} currentNode={item} rootId={rootId} />
        ))}
      </div>
    </div>
  );
};

export default UploadNode;
