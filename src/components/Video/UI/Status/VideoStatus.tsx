import { ReactComponent as PublicIcon } from 'assets/icons/public.svg';
import { ReactComponent as PrivateIcon } from 'assets/icons/private.svg';
import './VideoStatus.scss';

interface VideoStatusProps {
  status: string;
  brief?: boolean;
}

const VideoStatus: React.FC<VideoStatusProps> = ({ status, brief }) => {
  return (
    <div className="video-status">
      {status === 'public' ? <PublicIcon /> : <PrivateIcon />}
      {!brief && <span>Status: </span>}
      <span>{status.toUpperCase()}</span>
    </div>
  );
};

export default VideoStatus;
