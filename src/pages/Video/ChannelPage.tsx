import { Fragment, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import ChannelItem from 'components/User/Channel/Item/ChannelItem';
import VideoContainer from 'components/Video/Container/VideoContainer';
import VideoGrid from 'components/Video/Grid/VideoGrid';
import { useAppThunk } from 'hooks/store-hook';
import { ChannelData } from 'store/slices/user-slice';
import { fetchChannel } from 'store/thunks/user-thunk';
import { fetchVideos } from 'store/thunks/video-thunk';

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
      <VideoContainer>
        <ChannelItem data={data} loading={loading} />
        <VideoGrid onFetch={fetchVideos} />
      </VideoContainer>
    </Fragment>
  );
};

export default ChannelPage;
