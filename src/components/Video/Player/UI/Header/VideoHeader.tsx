import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import './VideoHeader.scss';

interface VideoHeaderProps {
  hideOn: boolean;
}

const VideoHeader: React.FC<VideoHeaderProps> = ({ hideOn }) => {
  const navigate = useNavigate();

  return (
    <div className={`vp-header${hideOn ? ` hide` : ''}`}>
      <AngleLeftIcon className="btn" onClick={() => navigate(-1)} />
    </div>
  );
};

export default memo(VideoHeader);
