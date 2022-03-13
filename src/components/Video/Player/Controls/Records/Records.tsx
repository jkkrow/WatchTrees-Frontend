import { memo } from 'react';

import Btn from '../Btn/Btn';
import { ReactComponent as LayersIcon } from 'assets/icons/layers.svg';
import './Records.scss';

interface RecordsProps {
  onToggle: () => void;
}

const Records: React.FC<RecordsProps> = ({ onToggle }) => {
  return (
    <div className="vp-controls__records">
      <Btn label="Records" onClick={onToggle}>
        <LayersIcon />
      </Btn>
    </div>
  );
};

export default memo(Records);
