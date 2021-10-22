import { memo } from "react";

import { ReactComponent as PlayIcon } from "assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "assets/icons/pause.svg";

const Playback = ({ playbackState, onToggle, onKey }) => (
  <div className="vp-controls__playback">
    <button className="vp-controls__btn" onClick={onToggle} onKeyDown={onKey}>
      {playbackState === "play" && <PlayIcon />}
      {playbackState === "pause" && <PauseIcon />}
    </button>
  </div>
);

export default memo(Playback);
