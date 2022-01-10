import { memo } from 'react';

import { ReactComponent as FullscreenIcon } from 'assets/icons/fullscreen.svg';
import { ReactComponent as FullscreenExitIcon } from 'assets/icons/fullscreen-exit.svg';
import './Fullscreen.scss';

interface FullscreenProps {
  fullscreenState: boolean;
  onToggle: () => void;
  onKey: (event: React.KeyboardEvent) => void;
}

const Fullscreen: React.FC<FullscreenProps> = ({
  fullscreenState,
  onToggle,
  onKey,
}) => (
  <div className="vp-controls__fullscreen">
    <button className="vp-controls__btn" onClick={onToggle} onKeyDown={onKey}>
      {!fullscreenState && <FullscreenIcon />}
      {fullscreenState && <FullscreenExitIcon />}
    </button>
  </div>
);

export default memo(Fullscreen);
