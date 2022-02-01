import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';

import VideoTree from 'components/Video/TreeView/Tree/VideoTree';
import VideoFavorites from 'components/Video/UI/Favorites/VideoFavorites';
import VideoTags from 'components/Video/UI/Tags/VideoTags';
import VideoViews from 'components/Video/UI/Views/VideoViews';
import VideoDuration from 'components/Video/UI/Duration/VideoDuration';
import VideoTimestamp from 'components/Video/UI/Timestamp/VideoTimestamp';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import Loader from '../Player/UI/Loader/Loader';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { VideoTreeClient } from 'store/slices/video-slice';
import { fetchVideo, toggleFavorites } from 'store/thunks/video-thunk';
import './VideoLayout.scss';

const VideoLayout: React.FC = () => {
  const { refreshToken } = useAppSelector((state) => state.user);
  const { dispatchThunk, dispatch, data, setData, loaded } =
    useAppDispatch<VideoTreeClient | null>(null);

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    dispatchThunk(fetchVideo(id));
  }, [dispatchThunk, id]);

  const toggleFavoritesHandler = async () => {
    if (!data) {
      return;
    }

    if (!refreshToken) {
      return history.push('/auth');
    }

    setData((prevState) => {
      const prev = prevState as VideoTreeClient;
      return {
        ...prev,
        data: {
          ...prev.data,
          favorites: prev.data.isFavorite
            ? prev.data.favorites - 1
            : prev.data.favorites + 1,
          isFavorite: !prev.data.isFavorite,
        },
      };
    });

    await dispatch(toggleFavorites(data._id!));
  };

  return (
    <div className="video-layout">
      <div className="video-layout__video">
        <Loader on={!loaded} />
        {data && <VideoTree tree={data} history={data.history} />}
      </div>
      {data && (
        <div className="video-layout__info">
          <div className="video-layout__info__header">
            <div className="video-layout__title">
              <h2>{data.info.title}</h2>
              <div className="video-layout__favorites">
                <VideoFavorites
                  favorites={data.data.favorites}
                  active={data.data.isFavorite}
                  onClick={toggleFavoritesHandler}
                />
              </div>
            </div>
            <div className="video-layout__createdAt">
              <VideoTimestamp createdAt={data.createdAt} />
            </div>
          </div>
          <div
            className="video-layout__creator"
            onClick={() => history.push(`/channel/${data.info.creator}`)}
          >
            <Avatar src={data.info.creatorInfo.picture} button />
            <h3 className="link">{data.info.creatorInfo.name}</h3>
          </div>
          <VideoTags tags={data.info.tags} />
          <div className="video-layout__detail">
            <VideoViews video={data} />
            <VideoDuration
              minDuration={data.info.minDuration}
              maxDuration={data.info.maxDuration}
            />
            <p className="video-layout__description">{data.info.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLayout;
