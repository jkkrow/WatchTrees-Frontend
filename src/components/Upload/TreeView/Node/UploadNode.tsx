import Content from './Body/Content';
import Controls from './Body/Controls';
import Error from './Body/Error';
import DragDrop from 'components/Common/UI/DragDrop/DragDrop';
import { useAppDispatch, useUploadSelector } from 'hooks/store-hook';
import { VideoNode } from 'store/reducers/video';
import { attachVideo } from 'store/actions/upload';
import './UploadNode.scss';

interface UploadNodeProps {
  currentNode: VideoNode;
  treeId: string;
}

const UploadNode: React.FC<UploadNodeProps> = ({ currentNode, treeId }) => {
  const { activeNodeId } = useUploadSelector();
  const dispatch = useAppDispatch();

  const onFileHandler = (file: File): void => {
    dispatch(attachVideo(file, currentNode.id, treeId));
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
          className="upload-node__body"
          style={{
            backgroundColor:
              currentNode.layer % 2 === 0 ? '#242424' : '#424242',
          }}
        >
          {currentNode.info ? (
            <>
              <Content currentNode={currentNode} treeId={treeId} />
              <Error currentNode={currentNode} error={currentNode.info.error} />
            </>
          ) : (
            <DragDrop type="video" onFile={onFileHandler} />
          )}
          <Controls currentNode={currentNode} treeId={treeId} />
        </div>
      )}

      <div className="upload-node__children">
        {currentNode.children.map((item) => (
          <UploadNode key={item.id} currentNode={item} treeId={treeId} />
        ))}
      </div>
    </div>
  );
};

export default UploadNode;
