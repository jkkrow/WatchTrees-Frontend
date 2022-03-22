import { memo } from 'react';

import './Progress.scss';

interface ProgressProps {
  videoDuration: number;
  currentProgress: number;
  bufferProgress: number;
  progressTooltip: string;
  progressTooltipPosition: string;
  selectionStartPoint: number;
  selectionEndPoint: number;
  editMode: boolean;
  onHover: (event: React.MouseEvent) => void;
  onSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Progress: React.FC<ProgressProps> = ({
  bufferProgress,
  currentProgress,
  videoDuration,
  progressTooltip,
  progressTooltipPosition,
  selectionStartPoint,
  selectionEndPoint,
  editMode,
  onHover,
  onSeek,
}) => {
  const preventDefault = (e: React.KeyboardEvent) => {
    e.preventDefault();
  };

  return (
    <div className="vp-controls__progress">
      <div className="vp-controls__progress__range">
        <div className="vp-controls__progress__range--background" />
        <div
          className="vp-controls__progress__range--buffer"
          style={{ width: bufferProgress + '%' }}
        />
        {editMode && (
          <div
            className="vp-controls__progress__range--selection-time"
            style={{
              left: (selectionStartPoint / videoDuration) * 100 + '%',
              width:
                ((selectionEndPoint - selectionStartPoint) / videoDuration) *
                  100 +
                '%',
            }}
          />
        )}
        <div
          className="vp-controls__progress__range--current"
          style={{ width: (currentProgress / videoDuration) * 100 + '%' }}
        >
          <div className="vp-controls__progress__range--current__thumb" />
        </div>
        <input
          className="vp-controls__progress__range--seek"
          type="range"
          step="any"
          max={videoDuration}
          value={currentProgress}
          onMouseMove={onHover}
          onChange={onSeek}
          onKeyDown={preventDefault}
        />
      </div>

      <span
        className="vp-controls__progress__tooltip"
        style={{ left: progressTooltipPosition }}
      >
        {progressTooltip}
      </span>
    </div>
  );
};

export default memo(Progress);
