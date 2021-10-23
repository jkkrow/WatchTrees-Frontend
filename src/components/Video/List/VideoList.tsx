import { useEffect, useRef, useState } from 'react';

import LoadingCard from 'components/Common/UI/Loader/Card/LoadingCard';
import './VideoList.scss';

const VideoList = () => {
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loaderNumber, setLoaderNumber] = useState([1]);

  const listRef = useRef();
  const itemRef = useRef();

  useEffect(() => {
    const listWidth = listRef.current.offsetWidth;
    const itemWidth = itemRef.current.offsetWidth;

    let rows = Math.floor(listWidth / itemWidth);

    if (rows === 1) rows = 3;

    setLoaderNumber(Array.from(Array(rows * 3)));
  }, []);

  return (
    <div className="video-list" ref={listRef}>
      {loaderNumber.map((item, index) => (
        <div
          key={index}
          className="video-item"
          ref={itemRef}
          onClick={() => setLoadingStatus(false)}
        >
          <LoadingCard on={loadingStatus} detail />
        </div>
      ))}
    </div>
  );
};

export default VideoList;
