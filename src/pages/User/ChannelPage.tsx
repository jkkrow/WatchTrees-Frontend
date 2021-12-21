import UserLayout from 'components/User/Layout/UserLayout';
import ChannelHeader from 'components/User/Channel/Header/ChannelHeader';
import VideoList from 'components/Video/List/VideoList';
import { fetchVideos } from 'store/thunks/video-thunk';

const ChannelPage: React.FC = () => {
  return (
    <UserLayout>
      <ChannelHeader />
      <VideoList onFetch={fetchVideos} />
    </UserLayout>
  );
};

export default ChannelPage;
