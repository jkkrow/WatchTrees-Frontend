import VideoTree from 'components/Video/TreeView/Tree/VideoTree';
import VideoDetail from 'components/Video/UI/Detail/VideoDetail';
import Loader from '../Player/UI/Loader/Loader';
import { VideoTreeClient } from 'store/types/video';
import './VideoLayout.scss';

interface VideoLayoutProps {
  video: VideoTreeClient | null;
  loaded: boolean;
}

const VideoLayout: React.FC<VideoLayoutProps> = ({ video, loaded }) => {
  return (
    <div className="video-layout">
      <section>
        <Loader
          on={!loaded}
          style={{ backgroundColor: 'hsl(0, 0%, 0%)', zIndex: 120 }}
        />
        {video && <VideoTree tree={video} history={video.history} />}
      </section>
      <section>{video && <VideoDetail video={video} />}</section>
    </div>
  );
};

export default VideoLayout;
