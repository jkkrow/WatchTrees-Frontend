import { useCallback, useEffect } from 'react';
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
  id?: 'history' | 'favorites';
  label?: string;
  forceUpdate?: boolean;
  onFetch: ReturnType<AppThunk>;
}

const VideoList: React.FC<VideoListProps> = ({
  id,
  label,
  forceUpdate,
  onFetch,
}) => {
  const { refreshToken, accessToken } = useAppSelector((state) => state.user);
  const { dispatchThunk, data, setData, loading, loaded } = useAppDispatch<{
    videos: VideoListDetail[];
    count: number;
  }>({
    videos: [],
    count: 0,
  });

  const { currentPage, itemsPerPage } = usePaginate(12);
  const { keyword } = useSearch();

  const { id: channelId } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    if (refreshToken && !accessToken) return;

    dispatchThunk(
      onFetch(
        {
          page: currentPage,
          max: itemsPerPage,
          search: keyword,
          channelId,
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
    channelId,
  ]);

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
      {label && (
        <h3 className={`video-list__label${!loaded ? ' loading' : ''}`}>
          {label}
        </h3>
      )}
      <VideoLoaderList loading={!loaded} rows={3} />
      <div className="video-list">
        {loaded &&
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
