import { memo, forwardRef } from 'react';

import './Progress.scss';

interface ProgressProps {
  videoDuration: number;
  bufferProgress: number;
  currentProgress: number;
  seekProgress: number;
  seekTooltipPosition: string;
  seekTooltip: string;
  selectionTimeStart: number | null;
  selectionTimeEnd: number | null;
  editMode: boolean;
  onHover: (event: React.MouseEvent) => void;
  onSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKey: (event: React.KeyboardEvent) => void;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      bufferProgress,
      currentProgress,
      videoDuration,
      seekProgress,
      seekTooltipPosition,
      seekTooltip,
      selectionTimeStart,
      selectionTimeEnd,
      editMode,
      onHover,
      onSeek,
      onKey,
    },
    ref
  ) => {
    const selectionTimeStartPosition =
      ((selectionTimeStart as number) >= videoDuration
        ? videoDuration - 10
        : selectionTimeStart) ?? videoDuration - 10;

    const selectionTimeEndPosition =
      ((selectionTimeEnd as number) > videoDuration
        ? videoDuration
        : selectionTimeEnd) ?? videoDuration;

    const selectionTimeDuration =
      ((selectionTimeEndPosition - selectionTimeStartPosition) /
        videoDuration) *
        100 +
      '%';

    return (
      <div className="vp-controls__progress" ref={ref}>
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
                left: (selectionTimeStartPosition / videoDuration) * 100 + '%',
                width: selectionTimeDuration,
              }}
            />
          )}
          <div
            className="vp-controls__progress__range--current"
            style={{ width: currentProgress + '%' }}
          >
            <div className="vp-controls__progress__range--current__thumb" />
          </div>
          <input
            className="vp-controls__progress__range--seek"
            type="range"
            step="any"
            max={videoDuration}
            value={seekProgress}
            onMouseMove={onHover}
            onChange={onSeek}
            onKeyDown={onKey}
          />
        </div>

        <span
          className="vp-controls__progress__tooltip"
          style={{ left: seekTooltipPosition }}
        >
          {seekTooltip}
        </span>
      </div>
    );
  }
);

export default memo(Progress);
