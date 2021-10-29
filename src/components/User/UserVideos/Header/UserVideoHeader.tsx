import { useHistory } from 'react-router';

import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as ReloadIcon } from 'assets/icons/reload.svg';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { initiateUpload } from 'store/actions/upload';
import { fetchUserVideos } from 'store/actions/user';
import './UserVideoHeader.scss';

const NewVideo: React.FC = () => {
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
    dispatch(fetchUserVideos());
  };

  return (
    <div className="user-video-header">
      <div className="user-video-header__reload">
        <Button inversed onClick={fetchVideosHandler}>
          <ReloadIcon />
        </Button>
      </div>
      <div className="user-video-header__new-video">
        <Button inversed onClick={addNewVideoHandler}>
          <PlusIcon />
          NEW VIDEO
        </Button>
      </div>
    </div>
  );
};

export default NewVideo;
