import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import VideoContainer from 'components/Video/Container/VideoContainer';
import VideoGrid from 'components/Video/Grid/VideoGrid';
import { usePaginate } from 'hooks/common/page';
import { useAppThunk } from 'hooks/common/store';
import { VideoTreeClient } from 'store/slices/video-slice';
import { fetchHistory } from 'store/thunks/video-thunk';

const HistoryPage: React.FC = () => {
  const { dispatchThunk, data, loading, loaded } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({ videos: [], count: 0 });

  const { currentPage, pageSize } = usePaginate();

  useEffect(() => {
    dispatchThunk(
      fetchHistory({
        page: currentPage,
        max: pageSize,
        skipFullyWatched: false,
      }),
      {
        forceUpdate: true,
      }
    );
  }, [dispatchThunk, currentPage, pageSize]);

  return (
    <Fragment>
      <Helmet>
        <title>History - WatchTree</title>
      </Helmet>
      <VideoContainer>
        <VideoGrid
          data={data}
          loading={loading}
          loaded={loaded}
          currentPage={currentPage}
          pageSize={pageSize}
          id="history"
          label="Watch History"
        />
      </VideoContainer>
    </Fragment>
  );
};

export default HistoryPage;
