import { memo } from 'react';

import Btn from '../Btn/Btn';
import { ReactComponent as TrackNextIcon } from 'assets/icons/track-next.svg';
import './Skip.scss';

interface SkipProps {
  onNext: () => void;
}

const Skip: React.FC<SkipProps> = ({ onNext }) => {
  return (
    <div className="vp-controls__skip">
      <Btn label="Next Video" onClick={onNext}>
        <TrackNextIcon />
      </Btn>
    </div>
  );
};

export default memo(Skip);
