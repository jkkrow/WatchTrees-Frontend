import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import VideoContainer from 'components/Video/Container/VideoContainer';
import VideoCarousel from 'components/Video/Carousel/VideoCarousel';
import VideoGroup from 'components/Video/Group/VideoGroup';
import VideoGrid from 'components/Video/Grid/VideoGrid';
import { useSearch } from 'hooks/search-hook';
import { fetchVideos, fetchHistory } from 'store/thunks/video-thunk';

const HomePage: React.FC = () => {
  const { keyword } = useSearch();

  return (
    <Fragment>
      <Helmet>
        <title>WatchTrees</title>
      </Helmet>
      <VideoContainer>
        {!keyword && (
          <>
            <VideoCarousel />
            <VideoGroup
              id="history"
              label="Recently Watched"
              to="/history"
              skipFullyWatched
              forceUpdate
              onFetch={fetchHistory}
            />
          </>
        )}
        {keyword && <h2>Tag: #{keyword}</h2>}
        <VideoGrid
          label={!keyword ? 'Recent Videos' : undefined}
          onFetch={fetchVideos}
        />
      </VideoContainer>
    </Fragment>
  );
};

export default HomePage;
