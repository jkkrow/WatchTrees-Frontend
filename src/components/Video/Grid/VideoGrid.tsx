import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import VideoItem from '../Item/VideoItem';
import LoaderGrid from 'components/Common/UI/Loader/Grid/LoaderGrid';
import VideoLoader from '../Loader/VideoLoader';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import NotFound from 'components/Common/UI/NotFound/NotFound';
import { ReactComponent as VideoIcon } from 'assets/icons/video.svg';
import { VideoTreeClient } from 'store/types/video';
import './VideoGrid.scss';

interface VideoGridProps {
  data: { videos: VideoTreeClient[]; count: number };
  loading: boolean;
  loaded: boolean;
  currentPage: number;
  pageSize: number;
  keyword?: string;
  id?: 'history' | 'favorites';
  label?: string;
  to?: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  data,
  loading,
  loaded,
  currentPage,
  pageSize,
  keyword,
  id,
  label,
  to,
}) => {
  const [videos, setVideos] = useState(data.videos);
  const [count, setCount] = useState(data.count);

  useEffect(() => {
    setVideos(data.videos);
    setCount(data.count);
  }, [data.videos, data.count]);

  const filterList = useCallback(
    (videoId: string) => {
      setVideos((prev) => prev.filter((video) => video._id !== videoId));
      setCount((prev) => prev--);
    },
    [setVideos, setCount]
  );

  return (
    <div className="video-grid">
      {label && (
        <h3 className={`video-grid__label${!loaded ? ' loading' : ''}`}>
          {to ? <Link to={to}>{label}</Link> : label}
        </h3>
      )}
      <LoaderGrid
        className="video-grid__loader"
        loading={!loaded}
        loader={<VideoLoader detail />}
        rows={3}
      />
      <div className="video-grid__container">
        <LoadingSpinner on={loaded && loading} overlay />
        {videos.map((item) => (
          <VideoItem
            key={item._id}
            id={id}
            video={item}
            onDelete={filterList}
          />
        ))}
      </div>
      {!loading && loaded && !videos.length && (
        <NotFound text={`No ${label || 'video'}`} icon={<VideoIcon />} />
      )}
      {loaded && (
        <Pagination
          count={count}
          currentPage={currentPage}
          pageSize={pageSize}
          keyword={keyword}
        />
      )}
    </div>
  );
};

export default VideoGrid;
