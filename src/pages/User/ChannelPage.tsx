import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import UserLayout from 'components/User/Layout/UserLayout';
import ChannelHeader from 'components/User/Channel/Header/ChannelHeader';
import VideoList from 'components/Video/List/VideoList';
import { useAppDispatch } from 'hooks/store-hook';
import { fetchVideos } from 'store/thunks/video-thunk';

const ChannelPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<{ id: string }>();

  const fetchVideosHandler = useCallback(
    async (params: any, forceUpdate: boolean) => {
      return await dispatch(
        fetchVideos({ ...params, channelId: id }, forceUpdate)
      );
    },
    [dispatch, id]
  );

  return (
    <UserLayout>
      <ChannelHeader channelId={id} />
      <VideoList onFetch={fetchVideosHandler} />
    </UserLayout>
  );
};

export default ChannelPage;
