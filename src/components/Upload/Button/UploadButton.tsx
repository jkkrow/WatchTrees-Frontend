import { useHistory } from 'react-router';

import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { uiActions } from 'store/slices/ui-slice';
import { initiateUpload } from 'store/thunks/upload-thunk';
import './UploadButton.scss';

const UploadButton: React.FC = () => {
  const { uploadTree } = useAppSelector((state) => state.upload);
  const { userData } = useAppSelector((state) => state.user);

  const { dispatch, dispatchThunk, loading } = useAppDispatch(null);

  const history = useHistory();

  const addNewVideoHandler = async () => {
    if (userData && !userData.isVerified) {
      dispatch(
        uiActions.setMessage({
          content: 'You need to verify account before upload video',
          type: 'error',
        })
      );

      return;
    }

    if (!uploadTree) {
      await dispatchThunk(initiateUpload());
    }

    history.push('/upload');
  };

  return (
    <div className="upload-button">
      <Button inversed onClick={addNewVideoHandler} loading={loading}>
        {!uploadTree ? (
          <>
            <PlusIcon style={{ width: '1.2rem', height: '1.2rem' }} />
            NEW VIDEO
          </>
        ) : (
          <>
            <EditIcon style={{ width: '1.5rem', height: '1.5rem' }} />
            CONTINUE
          </>
        )}
      </Button>
    </div>
  );
};

export default UploadButton;
