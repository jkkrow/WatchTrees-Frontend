import Content from './Body/Content';
import Controls from './Body/Controls';
import Error from './Body/Error';
import DragDrop from 'components/Upload/DragDrop/DragDrop';
import { useAppSelector, useAppThunk } from 'hooks/common/store';
import { VideoNode } from 'store/slices/video-slice';
import { uploadVideo } from 'store/thunks/upload-thunk';
import './UploadNode.scss';

interface UploadNodeProps {
  currentNode: VideoNode;
  rootId: string;
}

const UploadNode: React.FC<UploadNodeProps> = ({ currentNode, rootId }) => {
  const activeNodeId = useAppSelector((state) => state.upload.activeNodeId);
  const { dispatchThunk } = useAppThunk();

  const fileChangeHandler = (files: File[]): void => {
    dispatchThunk(uploadVideo(files[0], currentNode._id));
  };

  return (
    <div
      className={`upload-node${
        currentNode._id === activeNodeId ? ' active' : ''
      }`}
    >
      {(currentNode._id === activeNodeId ||
        currentNode.parentId === activeNodeId) && (
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
          <UploadNode key={item._id} currentNode={item} rootId={rootId} />
        ))}
      </div>
    </div>
  );
};

export default UploadNode;
