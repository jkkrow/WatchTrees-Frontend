import { Link } from 'react-router-dom';

import Avatar from 'components/Common/UI/Avatar/Avatar';
import { VideoTreeClient } from 'store/types/video';
import './VideoCreator.scss';

interface VideoCreatorProps {
  creator: VideoTreeClient['creator'];
}

const VideoCreator: React.FC<VideoCreatorProps> = ({ creator }) => {
  return (
    <Link className="video-creator" to={`/channel/${creator.id}`}>
      <Avatar width="2.5rem" height="2.5rem" src={creator.picture} />
      <div className="video-creator__name">{creator.name}</div>
    </Link>
  );
};

export default VideoCreator;
