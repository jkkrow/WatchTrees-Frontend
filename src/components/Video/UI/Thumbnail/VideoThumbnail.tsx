import { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import shaka from 'shaka-player';

import { ReactComponent as PreviewIcon } from 'assets/icons/preview.svg';
import { useTimeout } from 'hooks/timer-hook';
import { VideoTree } from 'store/slices/video-slice';
import { videoUrl, thumbanilUrl } from 'util/video';
import './VideoThumbnail.scss';

interface VideoThumbnailProps {
  video: VideoTree;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video }) => {
  const [isVideoPlay, setIsVideoPlay] = useState(false);

  const [thumbnailTimeout, clearThumbnailTimeout] = useTimeout();

  const videoRef = useRef<HTMLVideoElement | null>(null);
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

  const thumbnailHoverHandler = () => {
    thumbnailTimeout(() => {
      const videoElement = videoRef.current;

      setIsVideoPlay(true);
      videoElement && videoElement.play();
    }, 800);
  };

  const thumbnailHoverOutHandler = () => {
    const videoElement = videoRef.current;

    setIsVideoPlay(false);
    clearThumbnailTimeout();

    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  const timeChangeHandler = () => {
    const videoElement = videoRef.current!;

    if (videoElement.currentTime > 10) {
      videoElement.currentTime = 0;
    }
  };

  return (
    <div
      className="video-thumbnail"
      onClick={watchVideoHandler}
      onMouseEnter={thumbnailHoverHandler}
      onMouseLeave={thumbnailHoverOutHandler}
    >
      {thumbanilUrl(video) ? (
        <>
          {video.root.info && (
            <video muted loop ref={videoRef} onTimeUpdate={timeChangeHandler} />
          )}
          <img
            style={{ opacity: isVideoPlay ? 0 : 1 }}
            src={thumbanilUrl(video)}
            alt={video.info.title}
          />
        </>
      ) : (
        <PreviewIcon />
      )}
    </div>
  );
};

export default VideoThumbnail;
