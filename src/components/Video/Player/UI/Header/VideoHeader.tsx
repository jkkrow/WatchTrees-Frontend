import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import './VideoHeader.scss';

interface VideoHeaderProps {
  className: string;
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
}

const VideoHeader: React.FC<VideoHeaderProps> = ({
  className,
  onMouseDown,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`vp-header${className ? ` ${className}` : ''}`}
      onMouseDown={onMouseDown}
    >
      <AngleLeftIcon className="btn" onClick={() => navigate(-1)} />
    </div>
  );
};

export default memo(VideoHeader);
