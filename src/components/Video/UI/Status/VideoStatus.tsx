import { ReactComponent as PublicIcon } from 'assets/icons/public.svg';
import { ReactComponent as PrivateIcon } from 'assets/icons/private.svg';
import { VideoTree } from 'store/slices/video-slice';
import './VideoStatus.scss';

interface VideoStatusProps {
  video: VideoTree;
  brief?: boolean;
}

const VideoStatus: React.FC<VideoStatusProps> = ({ video, brief }) => {
  return (
    <div className="video-status">
      {video.info.status === 'public' ? <PublicIcon /> : <PrivateIcon />}
      {!brief && <span>Status: </span>}
      <span>{video.info.status.toUpperCase()}</span>
    </div>
  );
};

export default VideoStatus;
