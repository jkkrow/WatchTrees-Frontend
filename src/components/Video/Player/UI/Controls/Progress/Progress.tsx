import { memo, forwardRef } from 'react';

import './Progress.scss';

interface ProgressProps {
  videoDuration: number;
  bufferProgress: number;
  currentProgress: number;
  seekProgress: number;
  seekTooltipPosition: string;
  seekTooltip: string;
  selectionStartPoint: number;
  selectionEndPoint: number;
  editMode: boolean;
  onHover: (event: React.MouseEvent) => void;
  onSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
      selectionStartPoint,
      selectionEndPoint,
      editMode,
      onHover,
      onSeek,
    },
    ref
  ) => {
    const preventDefault = (e: React.KeyboardEvent) => {
      e.preventDefault();
    };

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
            onKeyDown={preventDefault}
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
