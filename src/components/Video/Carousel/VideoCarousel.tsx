import { useState, useEffect } from 'react';

import LoadingCard from 'components/Common/UI/Loader/Card/LoadingCard';
import './VideoCarousel.scss';

const VideoCarousel: React.FC = () => {
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {}, []);

  return (
    <div className="video-carousel" onClick={() => setLoadingStatus(false)}>
      <LoadingCard on={loadingStatus} />
    </div>
  );
};

export default VideoCarousel;
