import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Preview from '../Preview/Preview';
import VideoThumbnail from '../UI/Thumbnail/VideoThumbnail';
import VideoViews from '../UI/Views/VideoViews';
import VideoFavorites from '../UI/Favorites/VideoFavorites';
import VideoDuration from '../UI/Duration/VideoDuration';
import VideoTimestamp from '../UI/Timestamp/VideoTimestamp';
import VideoDropdown from '../UI/Dropdown/VideoDropdown';
import VideoCreator from '../UI/Creator/VideoCreator';
import Card from 'components/Common/UI/Card/Card';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { useTimeout } from 'hooks/common/timer';
import { useAppThunk } from 'hooks/common/store';
import { AppThunk } from 'store';
import { VideoTreeClient } from 'store/slices/video-slice';
import './VideoItem.scss';

interface VideoItemProps {
  id?: 'history' | 'favorites';
  video: VideoTreeClient;
  onDelete: (videoId: string) => void;
}

const VideoItem: React.FC<VideoItemProps> = ({ id, video, onDelete }) => {
  const { dispatchThunk, loading } = useAppThunk();

  const [isPreview, setIsPreview] = useState(false);
  const [transform, setTransform] = useState('none');
  const [transformOrigin, setTransfomOrigin] = useState('initial');
  const [zIndex, setZIndex] = useState(0);

  const [setPreviewTimeout, clearPreviewTimeout] = useTimeout();

  const itemRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const dispatchHandler = async (thunk: AppThunk) => {
    await dispatchThunk(thunk);

    onDelete(video._id);
  };

  const startPreviewHandler = () => {
    if (isPreview || !itemRef.current) return;

    const { top, bottom, left, width, height } =
      itemRef.current.getBoundingClientRect();

    const container = document.querySelector('.video-container')!;
    const { left: containerLeft, width: containerWidth } =
      container.getBoundingClientRect();

    const itemLeft = left - containerLeft;
    const itemRight = itemLeft + width;

    const viewHeight = window.innerHeight;

    let originX = '50%';
    let originY = '50%';
    let scaleValue = 1.3;

    const scaledWidth = width * scaleValue;
    const scaledHeight = height * scaleValue;

    if (scaledWidth + (containerWidth - itemRight) > containerWidth) {
      originX = '0%';
    }
    if (itemLeft + scaledWidth > containerWidth) {
      originX = '100%';
    }
    if (scaledHeight + (viewHeight - bottom) > viewHeight) {
      originY = '0%';
    }
    if (top + scaledHeight > viewHeight) {
      originY = '100%';
    }
    if (scaledWidth > containerWidth) {
      scaleValue = 1;
    }

    setPreviewTimeout(() => {
      setIsPreview(true);
      setTransform(`scale(${scaleValue})`);
      setTransfomOrigin(`${originX} ${originY}`);
      setZIndex(1);
    }, 700);
  };

  const stopPreviewHandler = () => {
    setIsPreview(false);
    setTransform('none');
  };

  const cancelPreviewHandler = () => {
    clearPreviewTimeout();
  };

  const previewUnmountedHandler = () => {
    setZIndex(0);
  };

  return (
    <Card
      className="video-item"
      style={{ transform, transformOrigin, zIndex }}
      ref={itemRef}
      onMouseLeave={stopPreviewHandler}
    >
      <LoadingSpinner on={loading} overlay />
      <div
        className="video-item__thumbnail"
        onMouseEnter={startPreviewHandler}
        onMouseLeave={cancelPreviewHandler}
      >
        <VideoThumbnail video={video} />
        <div className="video-item__duration">
          <VideoDuration
            minDuration={video.info.minDuration}
            maxDuration={video.info.maxDuration}
            brief
          />
        </div>
        <Preview
          on={isPreview}
          video={video}
          onUnmounted={previewUnmountedHandler}
        />
        {video.history && (
          <div
            className="video-item__history"
            style={{
              width: video.history.isEnded
                ? '100%'
                : (video.history.totalProgress / video.info.maxDuration) * 100 +
                  '%',
              opacity: isPreview ? 0 : 1,
            }}
          />
        )}
      </div>
      <div className="video-item__info">
        <div className="video-item__header">
          <Link to={`/video/${video._id}`} className="video-item__title">
            {video.info.title}
          </Link>
          <VideoDropdown id={id} video={video} onDispatch={dispatchHandler} />
        </div>
        {!location.pathname.includes('/channel/') && (
          <VideoCreator info={video.info} />
        )}
        <div className="video-item__detail">
          <div className="video-item__data">
            <VideoViews views={video.data.views} brief />
            <VideoFavorites
              videoId={video._id}
              favorites={video.data.favorites}
              isFavorite={video.data.isFavorite}
            />
          </div>
          <VideoTimestamp createdAt={video.createdAt} />
        </div>
      </div>
    </Card>
  );
};

export default VideoItem;
