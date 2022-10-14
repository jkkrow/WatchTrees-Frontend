import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { useAppDispatch } from 'hooks/common/store';
import { RenderNode } from 'store/types/upload';
import { uploadActions } from 'store/slices/upload-slice';

interface ErrorProps {
  currentNode: RenderNode;
  error: string | null;
}

const Error: React.FC<ErrorProps> = ({ currentNode, error }) => {
  const dispatch = useAppDispatch();

  const cancelHandler = () => {
    dispatch(
      uploadActions.updateNode({
        id: currentNode._id,
        info: {
          name: '',
          label: '',
          url: '',
          size: 0,
          duration: 0,
          selectionTimeStart: 0,
          selectionTimeEnd: 0,
          progress: 0,
          error: null,
        },
      })
    );
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
