import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import VideoContainer from 'components/Video/Container/VideoContainer';
import VideoGrid from 'components/Video/Grid/VideoGrid';
import { fetchHistory } from 'store/thunks/video-thunk';

const HistoryPage: React.FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>History - WatchTrees</title>
      </Helmet>
      <VideoContainer>
        <VideoGrid
          id="history"
          label="Watch History"
          forceUpdate
          onFetch={fetchHistory}
        />
      </VideoContainer>
    </Fragment>
  );
};

export default HistoryPage;
