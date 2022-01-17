import { memo } from 'react';

import Btn from '../Btn/Btn';
import { ReactComponent as TrackPrevIcon } from 'assets/icons/track-prev.svg';
import { ReactComponent as TrackFirstIcon } from 'assets/icons/track-first.svg';
import './Rewind.scss';

interface RewindProps {
  onRestart: () => void;
  onPrev: () => void;
}

const Rewind: React.FC<RewindProps> = ({ onRestart, onPrev }) => {
  return (
    <div className="vp-controls__rewind">
      <Btn label="Restart" onClick={onRestart}>
        <TrackFirstIcon />
      </Btn>
      <Btn label="Previous Video" onClick={onPrev}>
        <TrackPrevIcon />
      </Btn>
    </div>
  );
};

export default memo(Rewind);
