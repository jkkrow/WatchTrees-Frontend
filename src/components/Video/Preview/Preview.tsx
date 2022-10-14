import { CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';

import PreviewPlayer from './Player/PreviewPlayer';
import { VideoTreeClient } from 'store/types/video';
import './Preview.scss';

interface PreviewProps {
  video: VideoTreeClient;
  on: boolean;
  onUnmounted: () => void;
}

const Preview: React.FC<PreviewProps> = ({ video, on, onUnmounted }) => {
  const navigate = useNavigate();

  const watchVideoHandler = () => {
    navigate(`/video/${video._id}`);
  };

  return video.root ? (
    <CSSTransition
      in={on}
      classNames="video-preview"
      timeout={300}
      mountOnEnter
      unmountOnExit
      onExited={onUnmounted}
    >
      <div className="video-preview" onClick={watchVideoHandler}>
        <PreviewPlayer {...video.root} />
      </div>
    </CSSTransition>
  ) : null;
};

export default Preview;
