import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';

import VideoItem from '../Item/VideoItem';
import VideoLoaderList from '../Loader/List/VideoLoaderList';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import { usePaginate } from 'hooks/page-hook';
import { useSearch } from 'hooks/search-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { AppThunk } from 'store';
import { VideoListDetail } from 'store/slices/video-slice';
import './VideoList.scss';

interface VideoListProps {
  label?: string;
  forceUpdate?: boolean;
  onFetch: ReturnType<AppThunk>;
}

const VideoList: React.FC<VideoListProps> = ({
  label,
  forceUpdate,
  onFetch,
}) => {
  const { refreshToken, accessToken } = useAppSelector((state) => state.auth);
  const { dispatchThunk, data, loading, loaded } = useAppDispatch<{
    videos: VideoListDetail[];
    count: number;
  }>({
    videos: [],
    count: 0,
  });

  const { currentPage, itemsPerPage } = usePaginate(20);
  const { keyword } = useSearch();

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    if (refreshToken && !accessToken) return;

    dispatchThunk(
      onFetch(
        {
          page: currentPage,
          max: itemsPerPage,
          search: keyword,
          channelId: id,
        },
        forceUpdate || history.action !== 'POP'
      )
    );
  }, [
    refreshToken,
    accessToken,
    dispatchThunk,
    history,
    currentPage,
    itemsPerPage,
    keyword,
    onFetch,
    forceUpdate,
    id,
  ]);

  return (
    <div className="video-list__container">
      <VideoLoaderList loading={loading} rows={3} />
      {loaded && data.videos.length > 0 && label && (
        <h3 className="video-list__label">{label}</h3>
      )}
      <div className="video-list">
        {!loading &&
          data.videos.length > 0 &&
          data.videos.map((item) => <VideoItem key={item._id} video={item} />)}
      </div>
      {loaded && !data.videos.length && (
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
