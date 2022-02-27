import { Fragment, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import ChannelItem from 'components/User/Channel/Item/ChannelItem';
import VideoContainer from 'components/Video/Container/VideoContainer';
import VideoGrid from 'components/Video/Grid/VideoGrid';
import { usePaginate } from 'hooks/page-hook';
import { useAppThunk } from 'hooks/store-hook';
import { ChannelData } from 'store/slices/user-slice';
import { VideoTreeClient } from 'store/slices/video-slice';
import { fetchChannel } from 'store/thunks/user-thunk';
import { fetchVideos } from 'store/thunks/video-thunk';

const ChannelPage: React.FC = () => {
  const {
    dispatchThunk: channelThunk,
    data: channelData,
    loaded: channelLoaded,
  } = useAppThunk<ChannelData | null>(null);

  const {
    dispatchThunk: videoThunk,
    data: videoData,
    loading: videoLoading,
    loaded: videoLoaded,
  } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({ videos: [], count: 0 });

  const { id } = useParams();
  const { currentPage, pageSize } = usePaginate();

  useEffect(() => {
    channelThunk(fetchChannel(id!));
  }, [channelThunk, id]);

  useEffect(() => {
    videoThunk(
      fetchVideos({ page: currentPage, max: pageSize, channelId: id })
    );
  }, [videoThunk, currentPage, pageSize, id]);

  return (
    <Fragment>
      {channelData && (
        <Helmet>
          <title>{channelData.name} - WatchTrees</title>
        </Helmet>
      )}
      <VideoContainer>
        <ChannelItem data={channelData} loading={!channelLoaded} />
        <VideoGrid
          data={videoData}
          loading={videoLoading}
          loaded={videoLoaded}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </VideoContainer>
    </Fragment>
  );
};

export default ChannelPage;
