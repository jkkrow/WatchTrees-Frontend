import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import VideoContainer from 'components/Video/Container/VideoContainer';
import VideoGrid from 'components/Video/Grid/VideoGrid';
import { usePaginate } from 'hooks/common/page';
import { useAppThunk } from 'hooks/common/store';
import { VideoTreeClient } from 'store/types/video';
import { fetchVideos } from 'store/thunks/video-thunk';

const RecentPage: React.FC = () => {
  const { dispatchThunk, data, loading, loaded } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({ videos: [], count: 0 });

  const { currentPage, pageSize } = usePaginate();

  useEffect(() => {
    dispatchThunk(fetchVideos({ page: currentPage, max: pageSize }));
  }, [dispatchThunk, currentPage, pageSize]);

  return (
    <Fragment>
      <Helmet>
        <title>Recent Videos - WatchTree</title>
      </Helmet>
      <VideoContainer>
        <VideoGrid
          data={data}
          loading={loading}
          loaded={loaded}
          currentPage={currentPage}
          pageSize={pageSize}
          label="Recent Videos"
        />
      </VideoContainer>
    </Fragment>
  );
};

export default RecentPage;
