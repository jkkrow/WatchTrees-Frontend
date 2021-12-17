import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import VideoTree from 'components/Video/TreeView/Tree/VideoTree';
import VideoFavorites from '../UI/Favorites/VideoFavorites';
import VideoTags from 'components/Video/UI/Tags/VideoTags';
import VideoViews from '../UI/Views/VideoViews';
import VideoDuration from '../UI/Duration/VideoDuration';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { VideoItemDetail, videoActions } from 'store/slices/video-slice';
import { addToFavorites } from 'store/thunks/user-thunk';
import './VideoLayout.scss';

interface VideoLayoutProps {
  video: VideoItemDetail;
}

const VideoLayout: React.FC<VideoLayoutProps> = ({ video }) => {
  const { refreshToken } = useAppSelector((state) => state.auth);
  const [videoTree, setVideoTree] = useState(video);

  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!videoTree.history || videoTree.history.progress.isEnded) return;

    dispatch(
      videoActions.setActiveVideo(videoTree.history.progress.activeVideoId)
    );
    dispatch(videoActions.setInitialProgress(videoTree.history.progress.time));
  }, [dispatch, videoTree]);

  const addToFavoritesHandler = async () => {
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

    const data = await dispatch(addToFavorites(video._id!));

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
        <VideoTree tree={videoTree} />
      </div>
      <div className="video-layout__info">
        <div className="video-layout__header">
          <div className="video-layout__title">
            <h2>{videoTree.info.title}</h2>
            <div className="video-layout__favorites">
              <VideoFavorites
                video={videoTree}
                onClick={addToFavoritesHandler}
                active={videoTree.data.isFavorite}
              />
            </div>
          </div>
          <div className="video-layout__createdAt">
            {new Date(videoTree.createdAt).toLocaleDateString()}
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
          <VideoDuration video={videoTree} />
          <p className="video-layout__description">
            {videoTree.info.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoLayout;
