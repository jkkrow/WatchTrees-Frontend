import { memo } from 'react';

import Btn from '../Btn/Btn';
import { ReactComponent as FullscreenIcon } from 'assets/icons/fullscreen.svg';
import { ReactComponent as FullscreenExitIcon } from 'assets/icons/fullscreen-exit.svg';
import './Fullscreen.scss';

interface FullscreenProps {
  isFullscreen: boolean;
  onToggle: () => void;
}

const Fullscreen: React.FC<FullscreenProps> = ({ isFullscreen, onToggle }) => (
  <div className="vp-controls__fullscreen">
    <Btn
      label={isFullscreen ? 'Fullscreen Off' : 'Fullscreen'}
      onClick={onToggle}
    >
      {!isFullscreen && <FullscreenIcon />}
      {isFullscreen && <FullscreenExitIcon />}
    </Btn>
  </div>
);

export default memo(Fullscreen);
