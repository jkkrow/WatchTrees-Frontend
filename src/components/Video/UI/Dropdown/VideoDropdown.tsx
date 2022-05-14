import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { ReactComponent as MoreIcon } from 'assets/icons/more.svg';
import { ReactComponent as AngleRightIcon } from 'assets/icons/angle-right.svg';
import { useOutsideClickHander } from 'hooks/common/outside-click';
import { AppThunk } from 'store';
import { VideoTreeClient } from 'store/slices/video-slice';
import { toggleFavorites, removeFromHistory } from 'store/thunks/video-thunk';
import './VideoDropdown.scss';

interface VideoDropdownProps {
  id?: 'history' | 'favorites';
  video: VideoTreeClient;
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
      onDispatch(toggleFavorites(video._id));
    }
  };

  const dropdownRef =
    useOutsideClickHander<HTMLDivElement>(closeDropdownHandler);

  return id ? (
    <div className="video-dropdown" ref={dropdownRef}>
      <button onClick={toggleDropdownHandler}>
        <MoreIcon />
      </button>
      <CSSTransition
        in={isOpened}
        classNames="video-dropdown"
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        <ul className="video-dropdown__list">
          <li className="video-dropdown__item" onClick={closeDropdownHandler}>
            <AngleRightIcon />
          </li>
          <li className="video-dropdown__item" onClick={dispatchHandler}>
            {id === 'history' ? 'Remove from history' : 'Remove from favorites'}
          </li>
        </ul>
      </CSSTransition>
    </div>
  ) : null;
};

export default VideoDropdown;
