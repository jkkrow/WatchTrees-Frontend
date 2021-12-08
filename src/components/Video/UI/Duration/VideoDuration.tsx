import { ReactComponent as TimeIcon } from 'assets/icons/time.svg';
import { VideoTree } from 'store/slices/video-slice';
import { videoDuration } from 'util/video';
import { formatTime } from 'util/format';
import './VideoDuration.scss';

interface VideoDurationProps {
  video: VideoTree;
  brief?: boolean;
}

const VideoDuration: React.FC<VideoDurationProps> = ({ video, brief }) => {
  return brief ? (
    <div className="video-duration">
      <TimeIcon />
      <span>{videoDuration(video)}</span>
    </div>
  ) : (
    <>
      <div className="video-duration">
        <TimeIcon />
        <span>MinDuration: {formatTime(video.info.minDuration)}</span>
      </div>
      <div className="video-duration">
        <TimeIcon />
        <span>MaxDuration: {formatTime(video.info.maxDuration)}</span>
      </div>
    </>
  );
};

export default VideoDuration;
