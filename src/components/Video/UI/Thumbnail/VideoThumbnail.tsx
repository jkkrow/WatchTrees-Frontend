import { useRef, useEffect } from 'react';
import { useHistory } from 'react-router';
import shaka from 'shaka-player';

import { ReactComponent as PreviewIcon } from 'assets/icons/preview.svg';
import { VideoTree } from 'store/slices/video-slice';
import { videoUrl, thumbanilUrl } from 'util/video';
import './VideoThumbnail.scss';

interface VideoThumbnailProps {
  video: VideoTree;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const videoElement = videoRef.current;

      if (!videoElement || !video.root.info) return;

      const src = videoUrl(video.root.info.url, video.root.info.isConverted);
      const player = new shaka.Player(videoElement);

      await player.load(src);
    })();
  }, [video]);

  const watchVideoHandler = () => {
    history.push(`/video/${video._id}`);
  };

  return (
    <div className="video-thumbnail" onClick={watchVideoHandler}>
      {thumbanilUrl(video) ? (
        <img src={thumbanilUrl(video)} alt={video.info.title} />
      ) : (
        <PreviewIcon />
      )}
    </div>
  );
};

export default VideoThumbnail;
