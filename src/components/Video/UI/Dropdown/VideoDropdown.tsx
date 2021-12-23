import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import OutsideClickHandler from 'react-outside-click-handler';

import { ReactComponent as MoreIcon } from 'assets/icons/more.svg';
import { ReactComponent as AngleRightIcon } from 'assets/icons/angle-right.svg';
import { AppThunk } from 'store';
import { VideoListDetail } from 'store/slices/video-slice';
import { addToFavorites, removeFromHistory } from 'store/thunks/user-thunk';
import './VideoDropdown.scss';

interface VideoDropdownProps {
  id?: 'history' | 'favorites';
  video: VideoListDetail;
  onDispatch: (thunk: AppThunk) => void;
}

const VideoDropdown: React.FC<VideoDropdownProps> = ({
  id,
  video,
  onDispatch,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const toggleDropdownHandler = () => {
    setIsOpened((prev) => !prev);
  };

  const closeDropdownHandler = () => {
    setIsOpened(false);
  };

  const dispatchHandler = () => {
    if (id === 'history') {
      onDispatch(removeFromHistory(video));
    }

    if (id === 'favorites') {
      onDispatch(addToFavorites(video._id));
    }
  };

  return id ? (
    <OutsideClickHandler onOutsideClick={closeDropdownHandler}>
      <div className="video-dropdown">
        <button onClick={toggleDropdownHandler}>
          <MoreIcon />
        </button>
        <CSSTransition
          in={isOpened}
          classNames="video-dropdown"
          timeout={200}
          mountOnEnter
          unmountOnExit
        >
          <ul className="video-dropdown__list">
            <li className="video-dropdown__item" onClick={dispatchHandler}>
              {id === 'history'
                ? 'Remove from history'
                : 'Remove from favorites'}
            </li>
            <button onClick={closeDropdownHandler}>
              <AngleRightIcon />
            </button>
          </ul>
        </CSSTransition>
      </div>
    </OutsideClickHandler>
  ) : null;
};

export default VideoDropdown;
