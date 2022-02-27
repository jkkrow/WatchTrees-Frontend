import { useEffect, useRef, useState } from 'react';

import './LoaderGrid.scss';

interface LoaderGridProps {
  loading: boolean;
  loader: JSX.Element;
  className?: string;
  rows?: number;
}

const LoaderGrid: React.FC<LoaderGridProps> = ({
  loading,
  loader,
  className,
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
    <div
      className={`loader-grid${className ? ` ${className}` : ''}`}
      ref={listRef}
    >
      {loaders.length > 0 ? (
        loaders.map((_, index) => (
          <div key={index} ref={itemRef}>
            {loader}
          </div>
        ))
      ) : (
        <div ref={itemRef} style={{ opacity: 0 }} />
      )}
    </div>
  ) : null;
};

export default LoaderGrid;
