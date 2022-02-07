import ChannelHeader from 'components/User/Channel/Header/ChannelHeader';
import VideoList from 'components/Video/List/VideoList';
import { fetchVideos } from 'store/thunks/video-thunk';
import 'styles/video.scss';

const ChannelPage: React.FC = () => {
  return (
    <div className="videos-page">
      <ChannelHeader />
      <VideoList onFetch={fetchVideos} />
    </div>
  );
};

export default ChannelPage;
