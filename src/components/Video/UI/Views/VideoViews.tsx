import { ReactComponent as ViewIcon } from 'assets/icons/view.svg';
import { formatNumber } from 'util/format';
import './VideoViews.scss';

interface VideoViewsProps {
  views: number;
  brief?: boolean;
}

const VideoViews: React.FC<VideoViewsProps> = ({ views, brief }) => {
  return (
    <div className="video-views">
      <ViewIcon />
      {!brief && <span>Views: </span>}
      <span>{formatNumber(views)}</span>
    </div>
  );
};

export default VideoViews;
