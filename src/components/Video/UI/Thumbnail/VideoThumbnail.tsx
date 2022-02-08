import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { ReactComponent as PreviewIcon } from 'assets/icons/preview.svg';
import { VideoTree } from 'store/slices/video-slice';
import './VideoThumbnail.scss';

interface VideoThumbnailProps {
  video: VideoTree;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video }) => {
  const navigate = useNavigate();

  const thumbnailUrl = useMemo(() => {
    let src: string | undefined;

    if (video.root.info?.isConverted) {
      src = `${
        process.env.REACT_APP_RESOURCE_DOMAIN_CONVERTED
      }/${video.root.info.url.replace(/\.\w+$/, '.0000001.jpg')}`;
    }

    if (video.info.thumbnail.url) {
      src = `${process.env.REACT_APP_RESOURCE_DOMAIN_SOURCE}/${video.info.thumbnail.url}`;
    }

    return src;
  }, [video]);

  const watchVideoHandler = () => {
    navigate(`/video/${video._id}`);
  };

  return (
    <div className="video-thumbnail" onClick={watchVideoHandler}>
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt={video.info.title} />
      ) : (
        <PreviewIcon />
      )}
    </div>
  );
};

export default VideoThumbnail;
