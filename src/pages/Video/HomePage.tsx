import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import VideoContainer from 'components/Video/Container/VideoContainer';
import VideoCarousel from 'components/Video/Carousel/VideoCarousel';
import VideoGroup from 'components/Video/Group/VideoGroup';
import VideoGrid from 'components/Video/Grid/VideoGrid';
import { usePaginate } from 'hooks/page-hook';
import { useAppThunk } from 'hooks/store-hook';
import { VideoTreeClient } from 'store/slices/video-slice';
import { fetchVideos, fetchHistory } from 'store/thunks/video-thunk';

const HomePage: React.FC = () => {
  const {
    dispatchThunk: gridThunk,
    data: gridData,
    loading: gridLoading,
    loaded: gridLoaded,
  } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({ videos: [], count: 0 });

  const {
    dispatchThunk: groupThunk,
    data: groupData,
    loaded: groupLoaded,
  } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({ videos: [], count: 0 });

  const {
    dispatchThunk: carouselThunk,
    data: carouselData,
    loaded: carouselLoaded,
  } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({
    videos: [],
    count: 0,
  });

  const { currentPage, pageSize } = usePaginate();

  useEffect(() => {
    gridThunk(fetchVideos({ page: currentPage, max: pageSize }));
  }, [gridThunk, currentPage, pageSize]);

  useEffect(() => {
    groupThunk(fetchHistory({ max: 10, skipFullyWatched: true }), {
      forceUpdate: true,
    });
  }, [groupThunk]);

  useEffect(() => {
    carouselThunk(fetchVideos({ max: 5 }));
  }, [carouselThunk]);

  return (
    <Fragment>
      <Helmet>
        <title>WatchTrees</title>
      </Helmet>
      <VideoContainer>
        <VideoCarousel data={carouselData} loaded={carouselLoaded} />
        <VideoGroup
          data={groupData}
          loaded={groupLoaded}
          id="history"
          label="Recently Watched"
          to="/history"
        />
        <VideoGrid
          data={gridData}
          loading={gridLoading}
          loaded={gridLoaded}
          currentPage={currentPage}
          pageSize={pageSize}
          label="Recent Videos"
        />
      </VideoContainer>
    </Fragment>
  );
};

export default HomePage;
