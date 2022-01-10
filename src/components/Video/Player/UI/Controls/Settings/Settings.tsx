import { useState, memo, useMemo, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import OutsideClickHandler from 'react-outside-click-handler';

import { ReactComponent as SettingIcon } from 'assets/icons/gear.svg';
import { ReactComponent as ArrowLeft } from 'assets/icons/arrow-left.svg';
import './Settings.scss';

interface SettingsProps {
  resolutions: shaka.extern.TrackList;
  playbackRates: number[];
  activeResolution: number | 'auto';
  activePlaybackRate: number;
  onChangeResolution: (resolution: shaka.extern.Track | 'auto') => void;
  onChangePlaybackRate: (playbackRate: number) => void;
}

const Settings: React.FC<SettingsProps> = ({
  resolutions,
  playbackRates,
  activeResolution,
  activePlaybackRate,
  onChangeResolution,
  onChangePlaybackRate,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isIndex, setIsIndex] = useState(true);
  const [activeMenu, setActiveMenu] = useState<'resolution' | 'speed'>(
    'resolution'
  );

  const menuList = useMemo(() => {
    switch (activeMenu) {
      case 'resolution':
        return (
          <div className="vp-controls__settings__dropdown__menu">
            <div
              className="vp-controls__settings__dropdown__label"
              onClick={() => setIsIndex(true)}
            >
              <ArrowLeft />
              <span>Resolutions</span>
            </div>
            <ul className="vp-controls__settings__dropdown__list">
              {resolutions.map((resolution) => (
                <li
                  key={resolution.id}
                  className={`vp-controls__settings__dropdown__item${
                    activeResolution === resolution.height ? ' active' : ''
                  }`}
                  onClick={() => onChangeResolution(resolution)}
                >
                  {resolution.height}
                </li>
              ))}
              <li
                className={`vp-controls__settings__dropdown__item${
                  activeResolution === 'auto' ? ' active' : ''
                }`}
                onClick={() => onChangeResolution('auto')}
              >
                <span>Auto</span>
                {activeResolution === 'auto' && (
                  <span>
                    (
                    {
                      resolutions.find((resolution) => resolution.active)
                        ?.height
                    }
                    )
                  </span>
                )}
              </li>
            </ul>
          </div>
        );
      case 'speed':
        return (
          <div className="vp-controls__settings__dropdown__menu">
            <div
              className="vp-controls__settings__dropdown__label"
              onClick={() => setIsIndex(true)}
            >
              <ArrowLeft />
              <span>Speed</span>
            </div>
            <ul className="vp-controls__settings__dropdown__list">
              {playbackRates.map((playbackRate) => (
                <li
                  key={playbackRate}
                  className={`vp-controls__settings__dropdown__item${
                    activePlaybackRate === playbackRate ? ' active' : ''
                  }`}
                  onClick={() => onChangePlaybackRate(playbackRate)}
                >
                  {playbackRate}
                </li>
              ))}
            </ul>
          </div>
        );
    }
  }, [
    activeMenu,
    resolutions,
    playbackRates,
    activeResolution,
    activePlaybackRate,
    onChangeResolution,
    onChangePlaybackRate,
  ]);

  useEffect(() => {
    !isOpened && setIsIndex(true);
  }, [isOpened]);

  const selectMenuHandler = (activeMenu: 'resolution' | 'speed') => {
    setIsIndex(false);
    setActiveMenu(activeMenu);
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setIsOpened(false)}>
      <div className="vp-controls__settings">
        <button
          className="vp-controls__btn"
          onClick={() => setIsOpened((prev) => !prev)}
        >
          <SettingIcon />
        </button>
        <div
          className={`vp-controls__settings__dropdown${
            isOpened ? ' active' : ''
          }`}
        >
          <CSSTransition
            in={isIndex}
            classNames="menu-index"
            timeout={300}
            mountOnEnter
            unmountOnExit
          >
            <div className="vp-controls__settings__dropdown__menu">
              <ul className="vp-controls__settings__dropdown__list">
                {resolutions.length > 0 && (
                  <li
                    className="vp-controls__settings__dropdown__item"
                    onClick={() => selectMenuHandler('resolution')}
                  >
                    <span style={{ fontWeight: 600 }}>Resolutions</span>
                    <span style={{ marginLeft: 'auto' }}>
                      {activeResolution === 'auto'
                        ? `Auto (${
                            resolutions.find((resolution) => resolution.active)
                              ?.height
                          }p)`
                        : activeResolution + 'p'}
                    </span>
                  </li>
                )}
                <li
                  className="vp-controls__settings__dropdown__item"
                  onClick={() => selectMenuHandler('speed')}
                >
                  <span style={{ fontWeight: 600 }}>Speed</span>
                  <span style={{ marginLeft: 'auto' }}>
                    x {activePlaybackRate}
                  </span>
                </li>
              </ul>
            </div>
          </CSSTransition>

          <CSSTransition
            in={!isIndex}
            classNames="menu-main"
            timeout={300}
            mountOnEnter
            unmountOnExit
          >
            {menuList}
          </CSSTransition>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default memo(Settings);
