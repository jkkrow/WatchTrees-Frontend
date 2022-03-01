import { useCallback, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import { ReactComponent as FilmIcon } from 'assets/icons/film.svg';
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
      <OutsideClickHandler disabled onOutsideClick={closeDropdownHandler}>
        <Btn label="Records" onClick={toggleDropdownHandler}>
          <FilmIcon />
        </Btn>
      </OutsideClickHandler>
    </div>
  );
};

export default Records;
