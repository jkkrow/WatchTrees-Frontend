import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import VideoContainer from 'components/Video/Container/VideoContainer';
import VideoGrid from 'components/Video/Grid/VideoGrid';
import { fetchFavorites } from 'store/thunks/video-thunk';

const FavoritesPage: React.FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Favorite Videos - WatchTrees</title>
      </Helmet>
      <VideoContainer>
        <VideoGrid
          id="favorites"
          label="Favorite Videos"
          onFetch={fetchFavorites}
        />
      </VideoContainer>
    </Fragment>
  );
};

export default FavoritesPage;
