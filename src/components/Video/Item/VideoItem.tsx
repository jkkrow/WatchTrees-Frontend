import { useHistory, useLocation } from 'react-router-dom';

import VideoThumbnail from '../UI/Thumbnail/VideoThumbnail';
import VideoViews from '../UI/Views/VideoViews';
import VideoFavorites from '../UI/Favorites/VideoFavorites';
import VideoDuration from '../UI/Duration/VideoDuration';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import { VideoListDetail } from 'store/slices/video-slice';
import './VideoItem.scss';
import Tooltip from 'components/Common/UI/Tooltip/Tooltip';

interface VideoItemProps {
  video: VideoListDetail;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <div className="video-item">
      <div className="video-item__thumbnail">
        <VideoThumbnail video={video} />
        <div className="video-item__duration">
          <VideoDuration video={video} brief />
        </div>
      </div>
      <div className="video-item__info">
        {!location.pathname.includes('/channel/') && (
          <Tooltip text={video.info.creatorInfo.name} direction={'bottom'}>
            <Avatar
              src={video.info.creatorInfo.picture}
              width="4rem"
              height="4rem"
              button
              onClick={() => history.push(`/channel/${video.info.creator}`)}
            />
          </Tooltip>
        )}
        <div className="video-item__detail">
          <div
            className="video-item__title link"
            onClick={() => history.push(`/video/${video._id}`)}
          >
            {video.info.title}
          </div>
          <div className="video-item__data">
            <VideoViews video={video} brief />
            <VideoFavorites video={video} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
