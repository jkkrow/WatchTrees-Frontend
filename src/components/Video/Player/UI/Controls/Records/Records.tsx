import { useCallback, useState } from 'react';

import { ReactComponent as LayersIcon } from 'assets/icons/layers.svg';
import './Records.scss';
import Btn from '../Btn/Btn';

const Records: React.FC = () => {
  const [isOpened, setIsOpened] = useState(false);

  const toggleDropdownHandler = useCallback(() => {
    setIsOpened((prev) => !prev);
  }, []);

  const closeDropdownHandler = useCallback(() => {
    setIsOpened(false);
  }, []);

  return (
    <div className="vp-controls__records">
      <Btn label="Records" onClick={toggleDropdownHandler}>
        <LayersIcon />
      </Btn>
    </div>
  );
};

export default Records;
