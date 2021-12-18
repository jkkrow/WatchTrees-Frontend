import { useMemo, useState } from 'react';

import { formatDate } from 'util/format';
import './VideoTimestamp.scss';

interface VideoTimestampProps {
  createdAt: string | Date;
  timeSince?: boolean;
}

const VideoTimestamp: React.FC<VideoTimestampProps> = ({
  createdAt,
  timeSince = true,
}) => {
  const [isTimeSince, setIsTimeSince] = useState(timeSince);

  const { timeSinceString, dateString } = useMemo(() => {
    const timeSinceString = formatDate(createdAt);
    const dateString = new Date(createdAt)
      .toDateString()
      .split(' ')
      .slice(1)
      .join(' ');

    return { timeSinceString, dateString };
  }, [createdAt]);

  return (
    <div
      className="video-timestamp"
      onClick={() => setIsTimeSince((prev) => !prev)}
    >
      {isTimeSince ? timeSinceString : dateString}
    </div>
  );
};

export default VideoTimestamp;
