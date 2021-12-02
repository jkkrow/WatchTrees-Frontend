import { useHistory } from 'react-router';

import VideoThumbnail from '../Thumbnail/VideoThumbnail';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import { ReactComponent as ViewIcon } from 'assets/icons/view.svg';
import { ReactComponent as FavoriteIcon } from 'assets/icons/favorite.svg';
import { VideoTreeWithCreatorInfo } from 'store/slices/video-slice';
import { formatNumber } from 'util/format';
import './VideoItem.scss';

interface VideoItemProps {
  video: VideoTreeWithCreatorInfo;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  const history = useHistory();

  return (
    <div className="video-item">
      <div className="video-item__thumnbnail">
        <VideoThumbnail video={video} />
      </div>
      <div className="video-item__info">
        <Avatar
          src={video.info.creatorInfo.picture}
          width="3rem"
          height="3rem"
          button
          onClick={() => history.push(`/channel/${video.info.creator}`)}
        />
        <div className="video-item__detail">
          <div className="video-item__title link">{video.info.title}</div>
          <div className="video-item__data">
            <div className="video-item__views">
              <ViewIcon />
              <span>{formatNumber(video.data.views)}</span>
            </div>
            <div className="video-item__favorites">
              <FavoriteIcon />
              <span>{formatNumber(video.data.favorites)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
