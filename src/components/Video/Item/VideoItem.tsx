import { useHistory, useLocation } from 'react-router-dom';

import VideoThumbnail from '../UI/Thumbnail/VideoThumbnail';
import VideoViews from '../UI/Views/VideoViews';
import VideoFavorites from '../UI/Favorites/VideoFavorites';
import VideoDuration from '../UI/Duration/VideoDuration';
import VideoTimestamp from '../UI/Timestamp/VideoTimestamp';
import VideoDropdown from '../UI/Dropdown/VideoDropdown';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import LoadingSpinner from 'components/Common/UI/Loader/LoadingSpinner';
import { useAppThunk } from 'hooks/store-hook';
import { AppThunk } from 'store';
import { VideoTreeClient } from 'store/slices/video-slice';
import './VideoItem.scss';

interface VideoItemProps {
  id?: 'history' | 'favorites';
  video: VideoTreeClient;
  onDelete: (videoId: string) => void;
}

const VideoItem: React.FC<VideoItemProps> = ({ id, video, onDelete }) => {
  const { dispatchThunk, loading } = useAppThunk();

  const history = useHistory();
  const location = useLocation();

  const dispatchHandler = async (thunk: AppThunk) => {
    await dispatchThunk(thunk);

    onDelete(video._id);
  };

  return (
    <div className="video-item">
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
              width: video.history.progress.isEnded
                ? '100%'
                : (video.history.progress.time / video.info.maxDuration) * 100 +
                  '%',
            }}
          />
        )}
      </div>
      <div className="video-item__info">
        {!location.pathname.includes('/channel/') && (
          <Avatar
            src={video.info.creatorInfo.picture}
            width="4rem"
            height="4rem"
            button
            onClick={() => history.push(`/channel/${video.info.creator}`)}
          />
        )}
        <div className="video-item__detail">
          <div className="video-item__header">
            <div
              className="video-item__title link"
              onClick={() => history.push(`/video/${video._id}`)}
            >
              {video.info.title}
            </div>
            <VideoDropdown id={id} video={video} onDispatch={dispatchHandler} />
          </div>
          <div className="video-item__data">
            <VideoViews video={video} brief />
            <VideoFavorites
              videoId={video._id}
              favorites={video.data.favorites}
            />
            <VideoTimestamp createdAt={video.createdAt} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
