import { useHistory } from 'react-router';

import LoadingSpinner from 'components/Common/UI/Loader/LoadingSpinner';
import VideoThumbnail from 'components/Video/UI/Thumbnail/VideoThumbnail';
import VideoViews from 'components/Video/UI/Views/VideoViews';
import VideoFavorites from 'components/Video/UI/Favorites/VideoFavorites';
import VideoDuration from 'components/Video/UI/Duration/VideoDuration';
import VideoStatus from 'components/Video/UI/Status/VideoStatus';
import VideoTags from 'components/Video/UI/Tags/VideoTags';
import VideoTimestamp from 'components/Video/UI/Timestamp/VideoTimestamp';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { useAppSelector, useAppThunk } from 'hooks/store-hook';
import { VideoTreeClient } from 'store/slices/video-slice';
import { continueUpload } from 'store/thunks/upload-thunk';
import './MyVideoItem.scss';

interface MyVideoItemProps {
  item: VideoTreeClient;
  onDelete: (item: VideoTreeClient) => void;
}

const MyVideoItem: React.FC<MyVideoItemProps> = ({ item, onDelete }) => {
  const uploadTree = useAppSelector((state) => state.upload.uploadTree);
  const { dispatchThunk, loading } = useAppThunk();

  const history = useHistory();

  const editHandler = async (videoId: string) => {
    if (!uploadTree) {
      await dispatchThunk(continueUpload(videoId));
    }

    history.push(`/upload/${videoId}`);
  };

  return (
    <li className="my-video-item">
      <LoadingSpinner on={loading} overlay />
      <div className="my-video-item__thumbnail">
        <VideoThumbnail video={item} />
      </div>
      <div className="my-video-item__info">
        <h3 className="my-video-item__title">{item.info.title || '_'}</h3>
        <div className="my-video-item__tags">
          <VideoTags tags={item.info.tags} />
        </div>
        <div className="my-video-item__detail">
          <div>
            <div className="my-video-item__status">
              <VideoStatus status={item.info.status} brief />
            </div>
            <div className="my-video-item__duration">
              <VideoDuration
                minDuration={item.info.minDuration}
                maxDuration={item.info.maxDuration}
                brief
              />
            </div>
            <div className="my-video-item__data">
              <VideoViews video={item} brief />
              <VideoFavorites favorites={item.data.favorites} />
            </div>
          </div>
          <div>
            <VideoTimestamp createdAt={item.createdAt} timeSince={false} />
            <div className="my-video-item__buttons">
              <EditIcon onClick={() => editHandler(item._id!)} />
              <DeleteIcon onClick={() => onDelete(item)} />
            </div>
          </div>
        </div>
      </div>
      {item.info.isEditing && (
        <div className="my-video-item__editing">EDITING</div>
      )}
    </li>
  );
};

export default MyVideoItem;
