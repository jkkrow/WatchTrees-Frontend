import { ReactComponent as ViewIcon } from 'assets/icons/view.svg';
import { VideoTree } from 'store/slices/video-slice';
import { formatNumber } from 'util/format';
import './VideoViews.scss';

interface VideoViewsProps {
  video: VideoTree;
  brief?: boolean;
}

const VideoViews: React.FC<VideoViewsProps> = ({ video, brief }) => {
  return (
    <div className="video-views">
      <ViewIcon />
      {!brief && <span>Views: </span>}
      <span>{formatNumber(video.data.views)}</span>
    </div>
  );
};

export default VideoViews;
