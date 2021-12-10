import { useParams } from 'react-router';

import UserLayout from 'components/User/Layout/UserLayout';
import ChannelHeader from 'components/User/Channel/ChannelHeader';
import VideoList from 'components/Video/List/VideoList';
import { useAppDispatch } from 'hooks/store-hook';
import { fetchVideos } from 'store/thunks/video-thunk';

const ChannelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();

  const fetchVideosHandler = async (params: any, forceUpdate: boolean) => {
    return await dispatch(fetchVideos(params, forceUpdate));
  };

  return (
    <UserLayout>
      <ChannelHeader userId={id} />
      <VideoList params={{ userId: id }} onFetch={fetchVideosHandler} />
    </UserLayout>
  );
};

export default ChannelPage;
