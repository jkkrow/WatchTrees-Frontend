import { useHistory } from 'react-router';

import VideoThumbnail from '../UI/Thumbnail/VideoThumbnail';
import VideoViews from '../UI/Views/VideoViews';
import VideoFavorites from '../UI/Favorites/VideoFavorites';
import VideoDuration from '../UI/Duration/VideoDuration';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import { VideoListDetail } from 'store/slices/video-slice';
import './VideoItem.scss';

interface VideoItemProps {
  video: VideoListDetail;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  const history = useHistory();

  return (
    <div className="video-item">
      <div className="video-item__thumbnail">
        <VideoThumbnail video={video} />
        <div className="video-item__duration">
          <VideoDuration video={video} brief />
        </div>
      </div>
      <div className="video-item__info">
        <Avatar
          src={video.info.creatorInfo.picture}
          width="4rem"
          height="4rem"
          button
          onClick={() => history.push(`/channel/${video.info.creator}`)}
        />
        <div className="video-item__detail">
          <div className="video-item__title link">{video.info.title}</div>
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
