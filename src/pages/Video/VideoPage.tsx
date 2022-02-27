import { Fragment, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import VideoLayout from 'components/Video/Layout/VideoLayout';
import Loader from 'components/Video/Player/UI/Loader/Loader';
import { useAppThunk } from 'hooks/store-hook';
import { VideoTreeClient } from 'store/slices/video-slice';
import { fetchVideo } from 'store/thunks/video-thunk';

const VideoPage: React.FC = () => {
  const { dispatchThunk, data, loaded } = useAppThunk<VideoTreeClient | null>(
    null
  );

  const { id } = useParams();

  useEffect(() => {
    dispatchThunk(fetchVideo(id!));
  }, [dispatchThunk, id]);

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';

    return () => {
      document.documentElement.style.overflowY = 'scroll';
    };
  }, []);

  return (
    <Fragment>
      {data && (
        <Helmet>
          <title>{data.info.title} - WatchTrees</title>
          <meta name="description" content={data.info.description} />
        </Helmet>
      )}
      <Loader
        on={!loaded}
        style={{ backgroundColor: 'hsl(0, 0%, 0%)', zIndex: 120 }}
      />
      {data && <VideoLayout video={data} />}
    </Fragment>
  );
};

export default VideoPage;
