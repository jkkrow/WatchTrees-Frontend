import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { useAppDispatch } from 'hooks/common/store';
import { VideoNode } from 'store/types/video';
import { uploadActions } from 'store/slices/upload-slice';

interface ErrorProps {
  currentNode: VideoNode;
  error: string | null;
}

const Error: React.FC<ErrorProps> = ({ currentNode, error }) => {
  const dispatch = useAppDispatch();

  const cancelHandler = () => {
    dispatch(uploadActions.setNode({ info: null, nodeId: currentNode._id }));
  };

  return error ? (
    <div className="upload-node__error">
      <div className="upload-node__error__message">{error}</div>
      <div className="upload-node__error__action">
        <RemoveIcon className="btn" onClick={cancelHandler} />
      </div>
    </div>
  ) : null;
};

export default Error;
