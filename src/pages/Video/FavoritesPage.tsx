import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import VideoList from 'components/Video/List/VideoList';
import { fetchFavorites } from 'store/thunks/video-thunk';
import 'styles/video.scss';

const FavoritesPage: React.FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Favorite Videos - WatchTrees</title>
      </Helmet>
      <div className="videos-page">
        <VideoList
          id="favorites"
          label="Favorite Videos"
          onFetch={fetchFavorites}
        />
      </div>
    </Fragment>
  );
};

export default FavoritesPage;
