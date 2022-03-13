import { memo } from 'react';

import Btn from '../Btn/Btn';
import { ReactComponent as PlayIcon } from 'assets/icons/play.svg';
import { ReactComponent as PauseIcon } from 'assets/icons/pause.svg';
import './Playback.scss';

interface PlaybackProps {
  isPaused: boolean;
  onToggle: () => void;
}

const Playback: React.FC<PlaybackProps> = ({ isPaused, onToggle }) => (
  <div className="vp-controls__playback">
    <Btn label={isPaused ? 'Pause' : 'Play'} onClick={onToggle}>
      {!isPaused && <PlayIcon />}
      {isPaused && <PauseIcon />}
    </Btn>
  </div>
);

export default memo(Playback);
