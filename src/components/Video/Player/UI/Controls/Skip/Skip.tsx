import { ReactComponent as TrackNextIcon } from 'assets/icons/track-next.svg';
import './Skip.scss';

interface SkipProps {
  onNext: () => void;
}

const Skip: React.FC<SkipProps> = ({ onNext }) => {
  return (
    <div className="vp-controls__skip">
      <button className="vp-controls__btn" onClick={onNext}>
        <TrackNextIcon />
      </button>
    </div>
  );
};

export default Skip;
