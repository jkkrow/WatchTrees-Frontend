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
      <button className="vp-controls__btn rewind-first" onClick={onRestart}>
        <TrackFirstIcon />
      </button>
      <button className="vp-controls__btn rewind-prev" onClick={onPrev}>
        <TrackPrevIcon />
      </button>
    </div>
  );
};

export default Rewind;
