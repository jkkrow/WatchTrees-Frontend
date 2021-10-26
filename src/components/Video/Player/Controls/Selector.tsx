import { memo } from 'react';

import { VideoNode } from 'store/reducers/video';

interface SelectorProps {
  on: boolean;
  high: boolean;
  next: VideoNode[];
  onSelect: (index: number) => void;
}

const Selector: React.FC<SelectorProps> = ({ on, high, next, onSelect }) => (
  <div className={`vp-selector${on ? ' active' : ''}${high ? ' high' : ''}`}>
    {next.map(
      (video: VideoNode, index: number) =>
        video.info && (
          <button
            key={video.id}
            className="vp-selector__btn"
            onClick={() => onSelect(index)}
          >
            {video.info.label}
          </button>
        )
    )}
  </div>
);

export default memo(Selector);
