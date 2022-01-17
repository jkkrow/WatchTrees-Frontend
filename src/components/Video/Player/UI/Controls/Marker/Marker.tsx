import { memo } from 'react';

import Btn from '../Btn/Btn';
import { ReactComponent as MarkerIcon } from 'assets/icons/marker.svg';
import './Marker.scss';

interface MarkerProps {
  isMarked: boolean;
  onMark: () => void;
}

const Marker: React.FC<MarkerProps> = ({ isMarked, onMark }) => {
  return (
    <div className={`vp-controls__mark${isMarked ? ' active' : ''}`}>
      <Btn
        label={isMarked ? 'Mark Endpoint' : 'Mark Startpoint'}
        onClick={onMark}
      >
        <MarkerIcon />
      </Btn>
    </div>
  );
};

export default memo(Marker);
