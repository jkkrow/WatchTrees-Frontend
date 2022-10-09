import { useNavigate } from 'react-router';

import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import VideoThumbnail from 'components/Video/UI/Thumbnail/VideoThumbnail';
import VideoViews from 'components/Video/UI/Views/VideoViews';
import VideoFavorites from 'components/Video/UI/Favorites/VideoFavorites';
import VideoDuration from 'components/Video/UI/Duration/VideoDuration';
import VideoStatus from 'components/Video/UI/Status/VideoStatus';
import VideoTags from 'components/Video/UI/Tags/VideoTags';
import VideoTimestamp from 'components/Video/UI/Timestamp/VideoTimestamp';
import Card from 'components/Common/UI/Card/Card';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { useAppSelector, useAppThunk } from 'hooks/common/store';
import { VideoTreeClient } from 'store/types/video';
import { continueUpload } from 'store/thunks/upload-thunk';
import './CreatedVideoItem.scss';

interface CreatedVideoItemProps {
  item: VideoTreeClient;
  onDelete: (item: VideoTreeClient) => void;
}

const CreatedVideoItem: React.FC<CreatedVideoItemProps> = ({
  item,
  onDelete,
}) => {
  const uploadTree = useAppSelector((state) => state.upload.uploadTree);
  const { dispatchThunk, loading } = useAppThunk();

  const navigate = useNavigate();

  const editHandler = async (videoId: string) => {
    if (!uploadTree) {
      await dispatchThunk(continueUpload(videoId));
    }

    navigate(`/upload/${videoId}`);
  };

  return (
    <Card className="created-video-item">
      <LoadingSpinner on={loading} overlay />
      <div className="created-video-item__thumbnail">
        <VideoThumbnail video={item} />
      </div>
      <div className="created-video-item__info">
        <h3 className="created-video-item__title">{item.info.title || '_'}</h3>
        <div className="created-video-item__tags">
          <VideoTags tags={item.info.tags} />
        </div>
        <div className="created-video-item__detail">
          <div>
            <div className="created-video-item__status">
              <VideoStatus status={item.info.status} brief />
            </div>
            <div className="created-video-item__duration">
              <VideoDuration
                minDuration={item.info.minDuration}
                maxDuration={item.info.maxDuration}
                brief
              />
            </div>
            <div className="created-video-item__data">
              <VideoViews views={item.data.views} brief />
              <VideoFavorites
                videoId={item._id}
                favorites={item.data.favorites}
              />
            </div>
          </div>
          <div>
            <VideoTimestamp createdAt={item.createdAt} timeSince={false} />
            <div className="created-video-item__buttons">
              <EditIcon
                className="btn"
                onClick={() => editHandler(item._id!)}
              />
              <DeleteIcon className="btn" onClick={() => onDelete(item)} />
            </div>
          </div>
        </div>
      </div>
      {item.info.isEditing && (
        <div className="created-video-item__editing">EDITING</div>
      )}
    </Card>
  );
};

export default CreatedVideoItem;
