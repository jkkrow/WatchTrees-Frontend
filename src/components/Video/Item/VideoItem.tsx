import { Link, useLocation } from 'react-router-dom';

import VideoThumbnail from '../UI/Thumbnail/VideoThumbnail';
import VideoViews from '../UI/Views/VideoViews';
import VideoFavorites from '../UI/Favorites/VideoFavorites';
import VideoDuration from '../UI/Duration/VideoDuration';
import VideoTimestamp from '../UI/Timestamp/VideoTimestamp';
import VideoDropdown from '../UI/Dropdown/VideoDropdown';
import Card from 'components/Common/UI/Card/Card';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { useAppThunk } from 'hooks/store-hook';
import { AppThunk } from 'store';
import { VideoTreeClient } from 'store/slices/video-slice';
import './VideoItem.scss';
import VideoCreator from '../UI/Creator/VideoCreator';

interface VideoItemProps {
  id?: 'history' | 'favorites';
  video: VideoTreeClient;
  onDelete: (videoId: string) => void;
}

const VideoItem: React.FC<VideoItemProps> = ({ id, video, onDelete }) => {
  const { dispatchThunk, loading } = useAppThunk();

  const location = useLocation();

  const dispatchHandler = async (thunk: AppThunk) => {
    await dispatchThunk(thunk);

    onDelete(video._id);
  };

  return (
    <Card className="video-item">
      <LoadingSpinner on={loading} overlay />
      <div className="video-item__thumbnail">
        <VideoThumbnail video={video} />
        <div className="video-item__duration">
          <VideoDuration
            minDuration={video.info.minDuration}
            maxDuration={video.info.maxDuration}
            brief
          />
        </div>
        {video.history && (
          <div
            className="video-item__history"
            style={{
              width: video.history.isEnded
                ? '100%'
                : (video.history.totalProgress / video.info.maxDuration) * 100 +
                  '%',
            }}
          />
        )}
      </div>
      <div className="video-item__info">
        <div className="video-item__header">
          <Link to={`/video/${video._id}`} className="video-item__title">
            {video.info.title}
          </Link>
          <VideoDropdown id={id} video={video} onDispatch={dispatchHandler} />
        </div>
        {!location.pathname.includes('/channel/') && (
          <VideoCreator info={video.info} />
        )}
        <div className="video-item__detail">
          <div className="video-item__data">
            <VideoViews video={video} brief />
            <VideoFavorites
              videoId={video._id}
              favorites={video.data.favorites}
            />
          </div>
          <VideoTimestamp createdAt={video.createdAt} />
        </div>
      </div>
    </Card>
  );
};

export default VideoItem;
