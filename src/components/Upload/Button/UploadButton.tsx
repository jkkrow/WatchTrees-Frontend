import { useNavigate } from 'react-router';

import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { useAppSelector, useAppThunk } from 'hooks/common/store';
import { initiateUpload } from 'store/thunks/upload-thunk';
import './UploadButton.scss';

const UploadButton: React.FC = () => {
  const { dispatchThunk, loading } = useAppThunk();
  const uploadTree = useAppSelector((state) => state.upload.uploadTree);
  const navigate = useNavigate();

  const addNewVideoHandler = async () => {
    if (!uploadTree) {
      await dispatchThunk(initiateUpload());
    }

    navigate('/upload');
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
