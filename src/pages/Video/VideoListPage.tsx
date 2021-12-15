import { useCallback } from 'react';

import VideoCarousel from 'components/Video/Carousel/VideoCarousel';
import VideoList from 'components/Video/List/VideoList';
import { useSearch } from 'hooks/search-hook';
import { useAppDispatch } from 'hooks/store-hook';
import { fetchVideos } from 'store/thunks/video-thunk';

const VideoListPage: React.FC = () => {
  const { keyword } = useSearch();

  const dispatch = useAppDispatch();

  const fetchVideosHandler = useCallback(
    async (params: any, forceUpdate: boolean) => {
      return await dispatch(fetchVideos(params, forceUpdate));
    },
    [dispatch]
  );

  return (
    <div className="layout">
      {!keyword && <VideoCarousel />}
      <VideoList onFetch={fetchVideosHandler} />
    </div>
  );
};

export default VideoListPage;
