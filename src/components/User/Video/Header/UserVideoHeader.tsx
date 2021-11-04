import { useHistory } from 'react-router';

import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as ReloadIcon } from 'assets/icons/reload.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { initiateUpload } from 'store/actions/upload';
import { fetchUserVideos } from 'store/actions/user';
import './UserVideoHeader.scss';

interface UserVideoHeaderProps {
  currentPage: number;
}

const UserVideoHeader: React.FC<UserVideoHeaderProps> = ({ currentPage }) => {
  const { uploadTree } = useAppSelector((state) => state.upload);
  const dispatch = useAppDispatch();

  const history = useHistory();

  const addNewVideoHandler = (): void => {
    if (!uploadTree) {
      dispatch(initiateUpload());
    }

    history.push('/new-video');
  };

  const fetchVideosHandler = (): void => {
    dispatch(fetchUserVideos(currentPage));
  };

  return (
    <div className="user-video-header">
      <div>
        <Button inversed onClick={fetchVideosHandler}>
          <ReloadIcon />
        </Button>
      </div>
      <div>
        <Button inversed onClick={addNewVideoHandler}>
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
