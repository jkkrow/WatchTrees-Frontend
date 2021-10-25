import { forwardRef, memo } from 'react';

import { VideoNode } from 'store/reducers/video';

interface SelectorProps {
  on: boolean;
  high: boolean;
  next: VideoNode[];
  onSelect: (video: VideoNode) => void;
}

const Selector = forwardRef<HTMLDivElement, SelectorProps>(
  ({ on, high, next, onSelect }, ref) => (
    <div
      className={`vp-selector${on ? ' active' : ''}${high ? ' high' : ''}`}
      ref={ref}
    >
      {next.map(
        (video) =>
          video.info && (
            <button
              key={video.id}
              className="vp-selector__btn"
              onClick={() => onSelect(video)}
            >
              {video.info.label}
            </button>
          )
      )}
    </div>
  )
);

export default memo(Selector);
