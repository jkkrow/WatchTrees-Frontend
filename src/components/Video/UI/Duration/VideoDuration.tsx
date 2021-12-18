import { ReactComponent as TimeIcon } from 'assets/icons/time.svg';
import { formatTime } from 'util/format';
import './VideoDuration.scss';

interface VideoDurationProps {
  minDuration: number;
  maxDuration: number;
  brief?: boolean;
}

const VideoDuration: React.FC<VideoDurationProps> = ({
  minDuration,
  maxDuration,
  brief,
}) => {
  const formatted = {
    minDuration: formatTime(minDuration),
    maxDuration: formatTime(maxDuration),
  };

  return brief ? (
    <div className="video-duration">
      <TimeIcon />
      <span>
        {minDuration === maxDuration
          ? formatted.maxDuration
          : `${formatted.minDuration} - ${formatted.maxDuration}`}
      </span>
    </div>
  ) : (
    <>
      <div className="video-duration">
        <TimeIcon />
        <span>MinDuration: {formatted.minDuration}</span>
      </div>
      <div className="video-duration">
        <TimeIcon />
        <span>MaxDuration: {formatted.maxDuration}</span>
      </div>
    </>
  );
};

export default VideoDuration;
