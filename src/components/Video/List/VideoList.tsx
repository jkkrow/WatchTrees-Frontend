import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router';

import VideoItem from '../Item/VideoItem';
import VideoLoaderList from '../Loader/List/VideoLoaderList';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import { usePaginate } from 'hooks/page-hook';
import { useSearch } from 'hooks/search-hook';
import { useAppThunk } from 'hooks/store-hook';
import { AppThunk } from 'store';
import { VideoTreeClient } from 'store/slices/video-slice';
import './VideoList.scss';

interface VideoListProps {
  id?: 'history' | 'favorites';
  label?: string;
  max?: number;
  forceUpdate?: boolean;
  onFetch: ReturnType<AppThunk>;
}

const VideoList: React.FC<VideoListProps> = ({
  id,
  label,
  max = 12,
  forceUpdate,
  onFetch,
}) => {
  const { dispatchThunk, data, setData, loading, loaded } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({ videos: [], count: 0 }, { forceUpdate });

  const { currentPage, itemsPerPage } = usePaginate(max);
  const { keyword } = useSearch();

  const { id: channelId } = useParams<{ id: string }>();

  useEffect(() => {
    dispatchThunk(
      onFetch({
        page: currentPage,
        max: itemsPerPage,
        search: keyword,
        channelId,
      })
    );
  }, [dispatchThunk, currentPage, itemsPerPage, keyword, channelId, onFetch]);

  const filterList = useCallback(
    (videoId: string) => {
      setData((prevData) => ({
        videos: prevData.videos.filter((video) => video._id !== videoId),
        count: prevData.count--,
      }));
    },
    [setData]
  );

  return (
    <div className="video-list__container">
      {label && (loading || data.videos.length > 0) && (
        <h3 className={`video-list__label${loading ? ' loading' : ''}`}>
          {label}
        </h3>
      )}
      <VideoLoaderList loading={loading} rows={3} />
      <div className="video-list">
        {!loading &&
          data.videos.length > 0 &&
          data.videos.map((item) => (
            <VideoItem
              key={item._id}
              id={id}
              video={item}
              onDelete={filterList}
            />
          ))}
      </div>
      {!loading && loaded && !data.videos.length && (
        <div className="video-list__empty">No video found</div>
      )}
      {!loading && (
        <Pagination
          count={data.count}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          keyword={keyword}
        />
      )}
    </div>
  );
};

export default VideoList;
