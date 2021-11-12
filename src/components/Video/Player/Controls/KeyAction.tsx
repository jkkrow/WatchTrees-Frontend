import { CSSTransition } from 'react-transition-group';

import { ReactComponent as VolumeHighIcon } from 'assets/icons/volume-high.svg';
import { ReactComponent as VolumeMiddleIcon } from 'assets/icons/volume-middle.svg';
import { ReactComponent as VolumeLowIcon } from 'assets/icons/volume-low.svg';
import { ReactComponent as VolumeMuteIcon } from 'assets/icons/volume-mute.svg';
import { ReactComponent as DoubleArrowLeftIcon } from 'assets/icons/double-arrow-left.svg';
import { ReactComponent as DoubleArrowRightIcon } from 'assets/icons/double-arrow-right.svg';

interface KeyActionProps {
  on: boolean;
  volume: number;
}

const KeyAction: React.FC<KeyActionProps> = ({ on, volume }) => {
  return (
    <div className="vp-key-action">
      <CSSTransition
        in={on}
        classNames="vp-key-action__volume"
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        <div className="vp-key-action__volume">
          <div className="vp-key-action__volume__container">
            <div className="vp-key-action__volume__icon">
              {volume > 0.7 && <VolumeHighIcon />}
              {volume <= 0.7 && volume > 0.3 && <VolumeMiddleIcon />}
              {volume <= 0.3 && volume > 0 && <VolumeLowIcon />}
              {volume === 0 && <VolumeMuteIcon />}
            </div>
            <div className="vp-key-action__volume__range">
              <div className="vp-key-action__volume__range--background" />
              <div
                className="vp-key-action__volume__range--current"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CSSTransition>
      <div className="vp-key-action__skip rewind">
        <DoubleArrowLeftIcon />
      </div>
      <div className="vp-key-action__skip forward">
        <DoubleArrowRightIcon />
      </div>
    </div>
  );
};

export default KeyAction;
