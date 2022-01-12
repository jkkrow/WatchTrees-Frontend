import { useState } from 'react';
import { useHistory } from 'react-router';

import VideoTree from 'components/Video/TreeView/Tree/VideoTree';
import VideoFavorites from '../UI/Favorites/VideoFavorites';
import VideoTags from 'components/Video/UI/Tags/VideoTags';
import VideoViews from '../UI/Views/VideoViews';
import VideoDuration from '../UI/Duration/VideoDuration';
import VideoTimestamp from '../UI/Timestamp/VideoTimestamp';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { VideoItemDetail } from 'store/slices/video-slice';
import { toggleFavorites } from 'store/thunks/video-thunk';
import './VideoLayout.scss';

interface VideoLayoutProps {
  video: VideoItemDetail;
}

const VideoLayout: React.FC<VideoLayoutProps> = ({ video }) => {
  const { refreshToken } = useAppSelector((state) => state.user);
  const { dispatch } = useAppDispatch();

  const [videoTree, setVideoTree] = useState(video);

  const history = useHistory();

  const toggleFavoritesHandler = async () => {
    setVideoTree((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        favorites: prev.data.isFavorite
          ? prev.data.favorites - 1
          : prev.data.favorites + 1,
        isFavorite: !prev.data.isFavorite,
      },
    }));

    if (!refreshToken) {
      return history.push('/auth');
    }

    const data = await dispatch(toggleFavorites(video._id!));

    setVideoTree((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        favorites: data.favorites,
        isFavorite: data.isFavorite,
      },
    }));
  };

  return (
    <div className="video-layout">
      <div className="video-layout__video">
        <VideoTree tree={videoTree} history={videoTree.history} />
      </div>
      <div className="video-layout__info">
        <div className="video-layout__header">
          <div className="video-layout__title">
            <h2>{videoTree.info.title}</h2>
            <div className="video-layout__favorites">
              <VideoFavorites
                favorites={videoTree.data.favorites}
                active={videoTree.data.isFavorite}
                onClick={toggleFavoritesHandler}
              />
            </div>
          </div>
          <div className="video-layout__createdAt">
            <VideoTimestamp createdAt={videoTree.createdAt} />
          </div>
        </div>
        <div
          className="video-layout__creator"
          onClick={() => history.push(`/channel/${videoTree.info.creator}`)}
        >
          <Avatar src={videoTree.info.creatorInfo.picture} button />
          <h3 className="link">{videoTree.info.creatorInfo.name}</h3>
        </div>
        <VideoTags tags={videoTree.info.tags} />
        <div className="video-layout__detail">
          <VideoViews video={videoTree} />
          <VideoDuration
            minDuration={videoTree.info.minDuration}
            maxDuration={videoTree.info.maxDuration}
          />
          <p className="video-layout__description">
            {videoTree.info.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoLayout;
