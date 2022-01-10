import { memo } from 'react';

import { ReactComponent as PlayIcon } from 'assets/icons/play.svg';
import { ReactComponent as PauseIcon } from 'assets/icons/pause.svg';
import './Playback.scss';

interface PlaybackProps {
  play: boolean;
  onToggle: () => void;
  onKey: (event: React.KeyboardEvent) => void;
}

const Playback: React.FC<PlaybackProps> = ({ play, onToggle, onKey }) => (
  <div className="vp-controls__playback">
    <button className="vp-controls__btn" onClick={onToggle} onKeyDown={onKey}>
      {!play && <PlayIcon />}
      {play && <PauseIcon />}
    </button>
  </div>
);

export default memo(Playback);
