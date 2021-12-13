import { memo } from 'react';

import Tooltip from 'components/Common/UI/Tooltip/Tooltip';
import { ReactComponent as DoubleAngleLeftIcon } from 'assets/icons/double-angle-left.svg';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import { ReactComponent as AngleRightIcon } from 'assets/icons/angle-right.svg';
import { ReactComponent as MarkerIcon } from 'assets/icons/marker.svg';

interface NavigationProps {
  rootId: string;
  currentId: string;
  marked: boolean;
  onRestart: () => void;
  onPrev: () => void;
  onNext: () => void;
  onMark: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentId,
  rootId,
  marked,
  onRestart,
  onPrev,
  onNext,
  onMark,
}) => {
  const restartHandler = () => {
    currentId !== rootId && onRestart();
  };

  const prevHandler = () => {
    currentId !== rootId && onPrev();
  };

  return (
    <div className="vp-navigation">
      <Tooltip text="Return to first video" direction="bottom">
        <DoubleAngleLeftIcon
          className={currentId === rootId ? 'disabled' : ''}
          onClick={restartHandler}
        />
      </Tooltip>
      <Tooltip text="Back to previous video" direction="bottom">
        <AngleLeftIcon
          className={currentId === rootId ? 'disabled' : ''}
          onClick={prevHandler}
        />
      </Tooltip>
      <Tooltip text="Skip to next video" direction="bottom">
        <AngleRightIcon onClick={onNext} />
      </Tooltip>
      <Tooltip
        text={
          marked
            ? 'Mark selection time end point'
            : 'Mark selection time start point'
        }
        direction="bottom"
      >
        <MarkerIcon onClick={onMark} />
      </Tooltip>
    </div>
  );
};
export default memo(Navigation);
