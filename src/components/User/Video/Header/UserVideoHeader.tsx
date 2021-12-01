import { useState } from 'react';
import { useHistory } from 'react-router';

import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as ReloadIcon } from 'assets/icons/reload.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { userActions } from 'store/slices/user-slice';
import { initiateUpload } from 'store/thunks/upload-thunk';
import './UserVideoHeader.scss';

interface UserVideoHeaderProps {
  onReload: () => void;
}

const UserVideoHeader: React.FC<UserVideoHeaderProps> = ({ onReload }) => {
  const { uploadTree } = useAppSelector((state) => state.upload);
  const { userData } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const history = useHistory();

  const addNewVideoHandler = async () => {
    if (userData && !userData.isVerified) {
      return dispatch(
        userActions.userFail('You need to verify account before upload video')
      );
    }

    if (!uploadTree) {
      setLoading(true);

      await dispatch(initiateUpload());

      setLoading(false);
    }

    history.push('/upload');
  };

  return (
    <div className="user-video-header">
      <div>
        <Button inversed onClick={onReload}>
          <ReloadIcon />
        </Button>
      </div>
      <div>
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
    </div>
  );
};

export default UserVideoHeader;
