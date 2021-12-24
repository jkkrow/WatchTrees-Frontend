import ChannelHeader from 'components/User/Channel/Header/ChannelHeader';
import VideoList from 'components/Video/List/VideoList';
import { fetchVideos } from 'store/thunks/video-thunk';

const ChannelPage: React.FC = () => {
  return (
    <div className="layout">
      <ChannelHeader />
      <VideoList onFetch={fetchVideos} />
    </div>
  );
};

export default ChannelPage;
