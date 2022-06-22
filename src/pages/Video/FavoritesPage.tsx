import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import VideoGrid from 'components/Video/Grid/VideoGrid';
import { usePaginate } from 'hooks/common/page';
import { useAppThunk } from 'hooks/common/store';
import { VideoTreeClient } from 'store/slices/video-slice';
import { fetchFavorites } from 'store/thunks/video-thunk';

const FavoritesPage: React.FC = () => {
  const { dispatchThunk, data, loading, loaded } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({ videos: [], count: 0 });

  const { currentPage, pageSize } = usePaginate();

  useEffect(() => {
    dispatchThunk(fetchFavorites({ page: currentPage, max: pageSize }));
  }, [dispatchThunk, currentPage, pageSize]);

  return (
    <Fragment>
      <Helmet>
        <title>Favorite Videos - WatchTrees</title>
      </Helmet>

      <VideoGrid
        data={data}
        loading={loading}
        loaded={loaded}
        currentPage={currentPage}
        pageSize={pageSize}
        id="favorites"
        label="Favorite Videos"
      />
    </Fragment>
  );
};

export default FavoritesPage;
