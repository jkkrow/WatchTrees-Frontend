import { useNavigate } from 'react-router';

import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { useAppSelector, useAppThunk } from 'hooks/common/store';
import { initiateUpload } from 'store/thunks/upload-thunk';
import './UploadButton.scss';

const UploadButton: React.FC = () => {
  const { dispatchThunk, loading } = useAppThunk();
  const sourceTree = useAppSelector((state) => state.upload.sourceTree);
  const navigate = useNavigate();

  const addNewVideoHandler = async () => {
    if (!sourceTree) {
      await dispatchThunk(initiateUpload());
    }

    navigate('/upload');
  };

  return (
    <div className="upload-button">
      <Button inversed onClick={addNewVideoHandler} loading={loading}>
        {!sourceTree ? (
          <>
            <PlusIcon />
            NEW VIDEO
          </>
        ) : (
          <>
            <EditIcon />
            CONTINUE
          </>
        )}
      </Button>
    </div>
  );
};

export default UploadButton;
