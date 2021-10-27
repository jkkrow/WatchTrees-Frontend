import { useHistory } from 'react-router';

import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { useAppDispatch, useUploadSelector } from 'hooks/store-hook';
import { initiateUpload } from 'store/actions/upload';
import './NewVideo.scss';

const NewVideo: React.FC = () => {
  const { uploadTree } = useUploadSelector();
  const dispatch = useAppDispatch();

  const history = useHistory();

  const addNewVideoHandler = (): void => {
    if (!uploadTree) {
      dispatch(initiateUpload());
    }

    history.push('/new-video');
  };

  return (
    <div className="user-video-header">
      <div className="new-video">
        <Button inversed onClick={addNewVideoHandler}>
          <PlusIcon />
          NEW VIDEO
        </Button>
      </div>
    </div>
  );
};

export default NewVideo;
