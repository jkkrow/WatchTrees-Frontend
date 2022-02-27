import { useEffect } from 'react';

import MyVideoItem from '../Item/CreatedVideoItem';
import LoaderGrid from 'components/Common/UI/Loader/Grid/LoaderGrid';
import VideoLoader from 'components/Video/Loader/VideoLoader';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import { usePaginate } from 'hooks/page-hook';
import { useAppThunk } from 'hooks/store-hook';
import { AppThunk } from 'store';
import { VideoTreeClient } from 'store/slices/video-slice';
import { fetchCreated } from 'store/thunks/video-thunk';
import './CreatedVideoGrid.scss';

interface CreatedVideoGridProps {
  onDelete: (item: VideoTreeClient) => void;
  onFetched: (fn: ReturnType<AppThunk>) => void;
}

const CreatedVideoGrid: React.FC<CreatedVideoGridProps> = ({
  onDelete,
  onFetched,
}) => {
  const { dispatchThunk, reload, data, loading, loaded } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({
    videos: [],
    count: 0,
  });

  const { currentPage, itemsPerPage } = usePaginate(12);

  useEffect(() => {
    dispatchThunk(fetchCreated({ page: currentPage, max: itemsPerPage }));
  }, [dispatchThunk, currentPage, itemsPerPage]);

  useEffect(() => {
    onFetched(() => reload());
  }, [onFetched, reload]);

  return (
    <div className="created-video-grid">
      <LoaderGrid
        className="created-video-grid__loader"
        loading={!loaded}
        loader={<VideoLoader detail />}
        rows={3}
      />
      <div className="created-video-grid__container">
        <LoadingSpinner on={loaded && loading} overlay />
        {loaded &&
          data.videos.length > 0 &&
          data.videos.map((item) => (
            <MyVideoItem key={item._id} item={item} onDelete={onDelete} />
          ))}
      </div>
      {!loading && loaded && !data.videos.length && (
        <div className="created-video-grid__empty">No video found</div>
      )}
      {loaded && (
        <Pagination
          count={data.count}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};

export default CreatedVideoGrid;
