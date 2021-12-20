import { useEffect, useRef, useState } from 'react';

import ChannelLoaderItem from '../Item/ChannelLoaderItem';
import './ChannelLoaderList.scss';

interface ChannelLoaderListProps {
  loading: boolean;
  rows?: number;
}

const ChannelLoaderList: React.FC<ChannelLoaderListProps> = ({
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
    <div className="channel-loader-list" ref={listRef}>
      {loaders.length > 0 ? (
        loaders.map((_, index) => (
          <div key={index} ref={itemRef}>
            <ChannelLoaderItem on={!!loaders.length} column />
          </div>
        ))
      ) : (
        <div ref={itemRef} />
      )}
    </div>
  ) : null;
};

export default ChannelLoaderList;
