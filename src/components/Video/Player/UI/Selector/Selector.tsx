import { memo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { VideoNode } from 'store/types/video';
import './Selector.scss';

interface SelectorProps {
  on: boolean;
  timerOn: boolean;
  next: VideoNode[];
  leftTime: number;
  onSelect: (index: number) => void;
}

const Selector: React.FC<SelectorProps> = ({
  on,
  timerOn,
  next,
  leftTime,
  onSelect,
}) => {
  return (
    <div className={`vp-selector${on ? ' active' : ''}`}>
      <TransitionGroup className="vp-selector__container">
        {next.map((video, index) => (
          <CSSTransition
            key={video._id}
            classNames="vp-selector__btn"
            timeout={3000}
          >
            <button
              className="vp-selector__btn"
              onClick={() => onSelect(index)}
            >
              {video.info!.label}
            </button>
          </CSSTransition>
        ))}
      </TransitionGroup>
      <div className={`vp-selector__timer${timerOn ? ' active' : ''}`}>
        {`Selector disapears in . . . ${leftTime}`}
      </div>
    </div>
  );
};

export default memo(Selector);
