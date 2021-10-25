import { memo } from 'react';

import { ReactComponent as VolumeHighIcon } from 'assets/icons/volume-high.svg';
import { ReactComponent as VolumeMiddleIcon } from 'assets/icons/volume-middle.svg';
import { ReactComponent as VolumeLowIcon } from 'assets/icons/volume-low.svg';
import { ReactComponent as VolumeMuteIcon } from 'assets/icons/volume-mute.svg';

interface VolumeProps {
  volume: number;
  onToggle: () => void;
  onSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKey: (event: React.KeyboardEvent) => void;
}

const Volume: React.FC<VolumeProps> = ({ volume, onToggle, onSeek, onKey }) => (
  <div className="vp-controls__volume">
    <button className="vp-controls__btn" onClick={onToggle} onKeyDown={onKey}>
      {volume > 0.7 && <VolumeHighIcon />}
      {volume <= 0.7 && volume > 0.3 && <VolumeMiddleIcon />}
      {volume <= 0.3 && volume > 0 && <VolumeLowIcon />}
      {volume === 0 && <VolumeMuteIcon />}
    </button>
    <div className="vp-controls__volume__range">
      <div className="vp-controls__volume__range--background" />
      <div
        className="vp-controls__volume__range--current"
        style={{ width: `${volume * 100}%` }}
      />
      <input
        className="vp-controls__volume__range--seek"
        type="range"
        value={volume}
        max="1"
        step="0.05"
        onChange={onSeek}
        onKeyDown={onKey}
      />
    </div>
  </div>
);

export default memo(Volume);
