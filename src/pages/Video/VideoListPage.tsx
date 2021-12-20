import { useCallback } from 'react';

import VideoCarousel from 'components/Video/Slide/Carousel/VideoCarousel';
import VideoList from 'components/Video/List/VideoList';
import { useSearch } from 'hooks/search-hook';
import { useAppDispatch } from 'hooks/store-hook';
import { fetchVideos } from 'store/thunks/video-thunk';
import { fetchHistory } from 'store/thunks/user-thunk';
import VideoGroup from 'components/Video/Slide/Group/VideoGroup';

const VideoListPage: React.FC = () => {
  const { keyword } = useSearch();

  const dispatch = useAppDispatch();

  const fetchVideosHandler = useCallback(
    async (params: any, forceUpdate: boolean) => {
      return await dispatch(fetchVideos(params, forceUpdate));
    },
    [dispatch]
  );

  const fetchHistoryHandler = useCallback(
    async (forceUpdate: boolean) => {
      return await dispatch(fetchHistory({ max: 10 }, forceUpdate));
    },
    [dispatch]
  );

  return (
    <div className="layout">
      {!keyword && (
        <>
          <VideoCarousel />
          <VideoGroup label="Recently Watched" onFetch={fetchHistoryHandler} />
        </>
      )}
      {keyword && <h2>Tag: #{keyword}</h2>}
      <VideoList
        label={!keyword ? 'Recent Videos' : undefined}
        onFetch={fetchVideosHandler}
      />
    </div>
  );
};

export default VideoListPage;
