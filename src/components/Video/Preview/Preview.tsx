import { CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';

import PreviewPlayer from './Player/PreviewPlayer';
import { VideoTreeClient } from 'store/slices/video-slice';
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

  return video.root.info ? (
    <CSSTransition
      in={on}
      classNames="video-preview"
      timeout={300}
      mountOnEnter
      unmountOnExit
      onExited={onUnmounted}
    >
      <div className="video-preview" onClick={watchVideoHandler}>
        <PreviewPlayer
          id={video.root._id}
          info={video.root.info}
          children={video.root.children}
        />
      </div>
    </CSSTransition>
  ) : null;
};

export default Preview;
