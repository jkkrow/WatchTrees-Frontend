import { useHistory } from 'react-router';

import { ReactComponent as PreviewIcon } from 'assets/icons/preview.svg';
import { VideoTree } from 'store/slices/video-slice';
import { thumbanilUrl } from 'util/video';
import './VideoThumbnail.scss';

interface VideoThumbnailProps {
  video: VideoTree;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video }) => {
  const history = useHistory();

  const watchVideoHandler = () => {
    history.push(`/video/${video._id}`);
  };

  return (
    <div className="video-thumbnail" onClick={watchVideoHandler}>
      {thumbanilUrl(video) ? (
        <img src={thumbanilUrl(video)} alt={video.info.title} />
      ) : (
        <PreviewIcon />
      )}
    </div>
  );
};

export default VideoThumbnail;
