import { useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';

import PreviewPlayer from './Player/PreviewPlayer';
import { VideoTreeClient } from 'store/slices/video-slice';
import './Preview.scss';

interface PreviewProps {
  video: VideoTreeClient;
  on: boolean;
  onUnmounted: () => void;
}

const Preview: React.FC<PreviewProps> = ({ video, on, onUnmounted }) => {
  const src = useMemo(() => {
    if (!video.root.info) return;

    return video.root.info.isConverted
      ? `${process.env.REACT_APP_RESOURCE_DOMAIN_CONVERTED}/${video.root.info.url}`
      : `${process.env.REACT_APP_RESOURCE_DOMAIN_SOURCE}/${video.root.info.url}`;
  }, [video.root.info]);

  return src ? (
    <CSSTransition
      in={on}
      classNames="video-preview"
      timeout={300}
      mountOnEnter
      unmountOnExit
      onExited={onUnmounted}
    >
      <div className="video-preview">
        <PreviewPlayer videoId={video._id} src={src} />
      </div>
    </CSSTransition>
  ) : null;
};

export default Preview;
