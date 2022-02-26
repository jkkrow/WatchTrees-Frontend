import { Fragment, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import ChannelItem from 'components/User/Channel/Item/ChannelItem';
import VideoList from 'components/Video/List/VideoList';
import { useAppThunk } from 'hooks/store-hook';
import { ChannelData } from 'store/slices/user-slice';
import { fetchChannel } from 'store/thunks/user-thunk';
import { fetchVideos } from 'store/thunks/video-thunk';
import 'styles/video.scss';

const ChannelPage: React.FC = () => {
  const { dispatchThunk, data, loading } = useAppThunk<ChannelData | null>(
    null
  );

  const { id } = useParams();

  useEffect(() => {
    dispatchThunk(fetchChannel(id!));
  }, [dispatchThunk, id]);

  return (
    <Fragment>
      {data && (
        <Helmet>
          <title>{data.name} - WatchTrees</title>
        </Helmet>
      )}
      <div className="videos-page">
        <ChannelItem data={data} loading={loading} />
        <VideoList onFetch={fetchVideos} />
      </div>
    </Fragment>
  );
};

export default ChannelPage;
