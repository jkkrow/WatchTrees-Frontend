import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import VideoContainer from 'components/Video/Container/VideoContainer';
import VideoGrid from 'components/Video/Grid/VideoGrid';
import { usePaginate } from 'hooks/common/page';
import { useSearch } from 'hooks/common/search';
import { useAppThunk } from 'hooks/common/store';
import { VideoTreeClient } from 'store/types/video';
import { fetchVideos } from 'store/thunks/video-thunk';

const HomePage: React.FC = () => {
  const { dispatchThunk, data, loading, loaded } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({ videos: [], count: 0 });

  const { currentPage, pageSize } = usePaginate();
  const { keyword } = useSearch();

  useEffect(() => {
    dispatchThunk(
      fetchVideos({ page: currentPage, max: pageSize, search: keyword })
    );
  }, [dispatchThunk, currentPage, pageSize, keyword]);

  return (
    <Fragment>
      <Helmet>
        <title>WatchTree</title>
      </Helmet>
      <VideoContainer>
        <VideoGrid
          data={data}
          loading={loading}
          loaded={loaded}
          currentPage={currentPage}
          pageSize={pageSize}
          keyword={keyword}
          label={`Tag: #${keyword}`}
        />
      </VideoContainer>
    </Fragment>
  );
};

export default HomePage;
