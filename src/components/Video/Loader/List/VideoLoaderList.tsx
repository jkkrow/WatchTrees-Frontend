import { useEffect, useRef, useState } from 'react';

import VideoLoaderItem from '../Item/VideoLoaderItem';
import './VideoLoaderList.scss';

interface VideoLoaderListProps {
  loading: boolean;
  rows?: number;
}

const VideoLoaderList: React.FC<VideoLoaderListProps> = ({
  loading,
  rows = 1,
}) => {
  const [loaders, setLoaders] = useState<undefined[]>([]);

  const listRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) {
      const listWidth = listRef.current!.offsetWidth;
      const itemWidth = itemRef.current!.offsetWidth;

      const itemsPerView = Math.floor(listWidth / itemWidth);

      setLoaders(Array.from(Array(itemsPerView * rows)));
    } else {
      setLoaders([]);
    }
  }, [loading, rows]);

  return loading ? (
    <div className="video-loader-list" ref={listRef}>
      {loaders.length > 0 ? (
        loaders.map((_, index) => (
          <div key={index} ref={itemRef}>
            <VideoLoaderItem on={!!loaders.length} detail />
          </div>
        ))
      ) : (
        <div ref={itemRef} />
      )}
    </div>
  ) : null;
};

export default VideoLoaderList;
