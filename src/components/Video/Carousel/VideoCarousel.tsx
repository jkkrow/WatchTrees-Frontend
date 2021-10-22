import { useState, useEffect } from "react";

import LoadingCard from "components/Common/UI/Loader/Card/LoadingCard";
import "./VideoCarousel.scss";

const VideoCarousel = () => {
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {}, []);

  return (
    <div className="video-carousel">
      <LoadingCard on={loadingStatus} onClick={() => setLoadingStatus(false)} />
    </div>
  );
};

export default VideoCarousel;
