import { ReactComponent as MarkerIcon } from 'assets/icons/marker.svg';
import './Marker.scss';

interface MarkerProps {
  isMarked: boolean;
  onMark: () => void;
}

const Marker: React.FC<MarkerProps> = ({ isMarked, onMark }) => {
  return (
    <div className="vp-controls__mark">
      <button
        className={`vp-controls__btn${isMarked ? ' active' : ''}`}
        onClick={onMark}
      >
        <MarkerIcon />
      </button>
    </div>
  );
};

export default Marker;
