import { useState } from 'react';
import { useHistory } from 'react-router';

import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import VideoThumbnail from 'components/Video/UI/Thumbnail/VideoThumbnail';
import VideoViews from 'components/Video/UI/Views/VideoViews';
import VideoFavorites from 'components/Video/UI/Favorites/VideoFavorites';
import VideoDuration from 'components/Video/UI/Duration/VideoDuration';
import VideoStatus from 'components/Video/UI/Status/VideoStatus';
import VideoTags from 'components/Video/UI/Tags/VideoTags';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { VideoTree } from 'store/slices/video-slice';
import { initiateUpload } from 'store/thunks/upload-thunk';
import './UserVideoItem.scss';

interface UserVideoItemProps {
  item: VideoTree;
  onDelete: (item: VideoTree) => void;
}

const UserVideoItem: React.FC<UserVideoItemProps> = ({ item, onDelete }) => {
  const { uploadTree } = useAppSelector((state) => state.upload);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const history = useHistory();

  const editHandler = async (videoId: string) => {
    let result = true;

    if (!uploadTree) {
      result = false;
      setLoading(true);

      result = await dispatch(initiateUpload(videoId));
      setLoading(false);
    }

    result && history.push(`/upload/${videoId}`);
  };

  return (
    <li className="user-video-item">
      <LoadingSpinner on={loading} overlay />
      <div className="user-video-item__thumbnail">
        <VideoThumbnail video={item} />
      </div>
      <div className="user-video-item__info">
        <h3 className="user-video-item__title">{item.info.title || '_'}</h3>
        <div className="user-video-item__tags">
          <VideoTags tags={item.info.tags} />
        </div>
        <div className="user-video-item__detail">
          <div>
            <div className="user-video-item__status">
              <VideoStatus video={item} brief />
            </div>
            <div className="user-video-item__duration">
              <VideoDuration video={item} brief />
            </div>
            <div className="user-video-item__data">
              <VideoViews video={item} brief />
              <VideoFavorites video={item} />
            </div>
          </div>
          <div>
            <div>{new Date(item.createdAt).toLocaleDateString()}</div>
            <div className="user-video-item__buttons">
              <EditIcon onClick={() => editHandler(item._id!)} />
              <DeleteIcon onClick={() => onDelete(item)} />
            </div>
          </div>
        </div>
      </div>
      {item.info.isEditing && (
        <div className="user-video-item__editing">EDITING</div>
      )}
    </li>
  );
};

export default UserVideoItem;
