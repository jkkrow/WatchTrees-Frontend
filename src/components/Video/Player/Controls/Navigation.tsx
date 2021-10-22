import { memo } from "react";

import Tooltip from "components/Common/UI/Tooltip/Tooltip";
import { ReactComponent as DoubleAngleLeftIcon } from "assets/icons/double-angle-left.svg";
import { ReactComponent as AngleLeftIcon } from "assets/icons/angle-left.svg";
import { ReactComponent as AngleRightIcon } from "assets/icons/angle-right.svg";
import { ReactComponent as MarkerIcon } from "assets/icons/marker.svg";

const Navigation = ({
  activeVideoId,
  videoTree,
  marked,
  onRestart,
  onPrev,
  onNext,
  onMark,
}) => (
  <div className="vp-navigation">
    <Tooltip text="Return to first video" direction="bottom">
      <DoubleAngleLeftIcon
        className={activeVideoId === videoTree.root.id ? "disabled" : ""}
        onClick={activeVideoId !== videoTree.root.id ? onRestart : null}
      />
    </Tooltip>
    <Tooltip text="Back to previous video" direction="bottom">
      <AngleLeftIcon
        className={activeVideoId === videoTree.root.id ? "disabled" : ""}
        onClick={activeVideoId !== videoTree.root.id ? onPrev : null}
      />
    </Tooltip>
    <Tooltip text="Skip to next video" direction="bottom">
      <AngleRightIcon onClick={onNext} />
    </Tooltip>
    <Tooltip
      text={marked ? "Mark timeline end point" : "Mark timeline start point"}
      direction="bottom"
    >
      <MarkerIcon onClick={onMark} />
    </Tooltip>
  </div>
);

export default memo(Navigation);
