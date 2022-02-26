import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import VideoList from 'components/Video/List/VideoList';
import { fetchHistory } from 'store/thunks/video-thunk';
import 'styles/video.scss';

const HistoryPage: React.FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>History - WatchTrees</title>
      </Helmet>
      <div className="videos-page">
        <VideoList
          id="history"
          label="Watch History"
          forceUpdate
          onFetch={fetchHistory}
        />
      </div>
    </Fragment>
  );
};

export default HistoryPage;
