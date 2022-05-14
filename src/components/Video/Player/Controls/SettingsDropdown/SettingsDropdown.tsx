import { useState, memo, useCallback, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import { ReactComponent as ArrowLeftIcon } from 'assets/icons/arrow-left.svg';
import { useOutsideClickHander } from 'hooks/common/outside-click';
import './SettingsDropdown.scss';

type SettingsType = 'resolution' | 'speed';

interface SettingsDropdownProps {
  on: boolean;
  resolutions: shaka.extern.TrackList;
  playbackRates: number[];
  activeResolutionHeight: number | 'auto';
  activePlaybackRate: number;
  onClose: () => void;
  onChangeResolution: (resolution: shaka.extern.Track | 'auto') => void;
  onChangePlaybackRate: (playbackRate: number) => void;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  on,
  resolutions,
  playbackRates,
  activeResolutionHeight,
  activePlaybackRate,
  onClose,
  onChangeResolution,
  onChangePlaybackRate,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isIndex, setIsIndex] = useState(true);
  const [activeType, setActiveType] = useState<SettingsType>('resolution');
  const [dropdownHeight, setDropdownHeight] = useState<'initial' | number>(
    'initial'
  );

  const dropdownRef = useOutsideClickHander<HTMLDivElement>(onClose, isMounted);

  useEffect(() => {
    if (!on) return;

    const dropdown = dropdownRef.current!;
    const dropdownMenu = dropdown.firstChild as HTMLElement;

    setDropdownHeight(dropdownMenu?.offsetHeight || 'initial');
  }, [on, dropdownRef]);

  const dropdownEnteredHandler = useCallback(() => {
    setIsMounted(true);
  }, []);

  const dropdownExitedHandler = useCallback(() => {
    setIsMounted(false);
    setIsIndex(true);
    setDropdownHeight('initial');
  }, []);

  const selectMenuHandler = useCallback((activeType: SettingsType) => {
    return () => {
      setIsIndex(false);
      setActiveType(activeType);
    };
  }, []);

  const changeResolutionHandler = useCallback(
    (resolution: shaka.extern.Track | 'auto') => {
      return () => {
        onChangeResolution(resolution);
        setIsIndex(true);
      };
    },
    [onChangeResolution]
  );

  const changePlaybackRateHandler = useCallback(
    (playbackRate: number) => {
      return () => {
        onChangePlaybackRate(playbackRate);
        setIsIndex(true);
      };
    },
    [onChangePlaybackRate]
  );

  const calcHeight = useCallback((element: HTMLElement) => {
    setDropdownHeight(element.offsetHeight);
  }, []);

  const isValidResolution = !!resolutions.find(
    (resolution) => resolution.height === activeResolutionHeight
  );
  const autoResolutionHeight = resolutions.find(
    (resolution) => resolution.active
  )?.height;

  const indexMenu = (
    <div className="vp-controls__settings__dropdown__menu">
      <ul className="vp-controls__settings__dropdown__list">
        {resolutions.length > 0 && (
          <li
            className="vp-controls__settings__dropdown__item"
            onClick={selectMenuHandler('resolution')}
          >
            <span>Resolution</span>
            <span>
              {activeResolutionHeight === 'auto' || !isValidResolution
                ? `Auto (${autoResolutionHeight}p)`
                : `${activeResolutionHeight}p`}
            </span>
          </li>
        )}
        <li
          className="vp-controls__settings__dropdown__item"
          onClick={selectMenuHandler('speed')}
        >
          <span>Speed</span>
          <span>x {activePlaybackRate}</span>
        </li>
      </ul>
    </div>
  );

  const resolutionList = (
    <ul className="vp-controls__settings__dropdown__list">
      {resolutions.map((resolution) => (
        <li
          key={resolution.id}
          className={`vp-controls__settings__dropdown__item${
            activeResolutionHeight === resolution.height ? ' active' : ''
          }`}
          onClick={changeResolutionHandler(resolution)}
        >
          {resolution.height}p
        </li>
      ))}
      <li
        className={`vp-controls__settings__dropdown__item${
          activeResolutionHeight === 'auto' ? ' active' : ''
        }`}
        onClick={changeResolutionHandler('auto')}
      >
        <span>Auto</span>
      </li>
    </ul>
  );

  const playbackRateList = (
    <ul className="vp-controls__settings__dropdown__list">
      {playbackRates.map((playbackRate) => (
        <li
          key={playbackRate}
          className={`vp-controls__settings__dropdown__item${
            activePlaybackRate === playbackRate ? ' active' : ''
          }`}
          onClick={changePlaybackRateHandler(playbackRate)}
        >
          {playbackRate}
        </li>
      ))}
    </ul>
  );

  const mainMenu = (
    <div className="vp-controls__settings__dropdown__menu">
      <div
        className="vp-controls__settings__dropdown__label"
        onClick={() => setIsIndex(true)}
      >
        <ArrowLeftIcon />
        <span>{activeType === 'resolution' && 'Resolution'}</span>
        <span>{activeType === 'speed' && 'Speed'}</span>
      </div>
      {activeType === 'resolution' && resolutionList}
      {activeType === 'speed' && playbackRateList}
    </div>
  );

  return (
    <CSSTransition
      in={on}
      classNames="vp-dropdown"
      timeout={200}
      mountOnEnter
      unmountOnExit
      onEntered={dropdownEnteredHandler}
      onExited={dropdownExitedHandler}
    >
      <div
        className="vp-controls__settings__dropdown"
        ref={dropdownRef}
        style={{ height: dropdownHeight }}
      >
        <CSSTransition
          in={isIndex}
          classNames="vp-menu-index"
          timeout={300}
          mountOnEnter
          unmountOnExit
          onEnter={calcHeight}
        >
          {indexMenu}
        </CSSTransition>

        <CSSTransition
          in={!isIndex}
          classNames="vp-menu-main"
          timeout={300}
          mountOnEnter
          unmountOnExit
          onEnter={calcHeight}
        >
          {mainMenu}
        </CSSTransition>
      </div>
    </CSSTransition>
  );
};

export default memo(SettingsDropdown);
