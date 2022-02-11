import { useEffect } from 'react';

import MyVideoItem from '../Item/MyVideoItem';
import LoaderList from 'components/Common/UI/Loader/List/LoaderList';
import VideoLoader from 'components/Video/Loader/VideoLoader';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import { usePaginate } from 'hooks/page-hook';
import { useAppThunk } from 'hooks/store-hook';
import { AppThunk } from 'store';
import { VideoTreeClient } from 'store/slices/video-slice';
import { fetchCreated } from 'store/thunks/video-thunk';
import './MyVideoList.scss';

interface MyVideoListProps {
  onDelete: (item: VideoTreeClient) => void;
  onFetched: (fn: ReturnType<AppThunk>) => void;
}

const MyVideoList: React.FC<MyVideoListProps> = ({ onDelete, onFetched }) => {
  const { dispatchThunk, reload, data, loading, loaded } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({
    videos: [],
    count: 0,
  });

  const { currentPage, itemsPerPage } = usePaginate(10);

  useEffect(() => {
    dispatchThunk(fetchCreated({ page: currentPage, max: itemsPerPage }));
  }, [dispatchThunk, currentPage, itemsPerPage]);

  useEffect(() => {
    onFetched(() => reload());
  }, [onFetched, reload]);

  return (
    <div className="my-video-list">
      <LoaderList
        className="my-video-list__loader"
        loading={loading}
        loader={<VideoLoader detail />}
        rows={3}
      />
      <div className="my-video-list__container">
        {!loading &&
          data.videos.length > 0 &&
          data.videos.map((item) => (
            <MyVideoItem key={item._id} item={item} onDelete={onDelete} />
          ))}
      </div>
      {!loading && loaded && !data.videos.length && (
        <div className="my-video-list__empty">No video found</div>
      )}
      {!loading && (
        <Pagination
          count={data.count}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};

export default MyVideoList;
