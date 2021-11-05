import { memo, forwardRef } from 'react';

interface ProgressProps {
  videoDuration: number;
  bufferProgress: number;
  currentProgress: number;
  seekProgress: number;
  seekTooltipPosition: string;
  seekTooltip: string;
  timelineStart: number | null;
  timelineEnd: number | null;
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
      timelineStart,
      timelineEnd,
      editMode,
      onHover,
      onSeek,
      onKey,
    },
    ref
  ) => {
    const timelineStartPosition =
      ((timelineStart as number) >= videoDuration
        ? videoDuration - 10
        : timelineStart) ?? videoDuration - 10;

    const timelineEndPosition =
      ((timelineEnd as number) > videoDuration ? videoDuration : timelineEnd) ??
      videoDuration;

    const timelineDuration =
      ((timelineEndPosition - timelineStartPosition) / videoDuration) * 100 +
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
              className="vp-controls__progress__range--timeline"
              style={{
                left: (timelineStartPosition / videoDuration) * 100 + '%',
                width: timelineDuration,
              }}
            />
          )}
          <div
            className="vp-controls__progress__range--current"
            style={{ width: currentProgress + '%' }}
          />
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
