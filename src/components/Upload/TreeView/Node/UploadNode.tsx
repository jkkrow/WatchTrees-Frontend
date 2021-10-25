import Content from './Body/Content';
import Controls from './Body/Controls';
import DragDrop from 'components/Common/UI/DragDrop/DragDrop';
import {
  useAppDispatch,
  useAuthSelector,
  useUploadSelector,
} from 'hooks/store-hook';
import { UploadNode as UploadNodeType } from 'store/reducers/upload';
import { attachVideo } from 'store/actions/upload';
import './UploadNode.scss';

interface UploadNodeProps {
  currentNode: UploadNodeType;
  treeId: string;
}

const UploadNode: React.FC<UploadNodeProps> = ({ currentNode, treeId }) => {
  const { accessToken } = useAuthSelector();
  const { activeNodeId } = useUploadSelector();
  const dispatch = useAppDispatch();

  const onFileHandler = (file: File): void => {
    dispatch(attachVideo(file, currentNode.id, treeId, accessToken!));
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
            <Content currentNode={currentNode} treeId={treeId} />
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
