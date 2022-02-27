import VideoTree from 'components/Video/TreeView/Tree/VideoTree';
import VideoDetail from 'components/Video/UI/Detail/VideoDetail';
import { VideoTreeClient } from 'store/slices/video-slice';
import './VideoLayout.scss';

interface VideoLayoutProps {
  video: VideoTreeClient;
}

const VideoLayout: React.FC<VideoLayoutProps> = ({ video }) => {
  return (
    <div className="video-layout">
      <section>
        <VideoTree tree={video} history={video.history} />
      </section>
      <section>
        <VideoDetail video={video} />
      </section>
    </div>
  );
};

export default VideoLayout;
