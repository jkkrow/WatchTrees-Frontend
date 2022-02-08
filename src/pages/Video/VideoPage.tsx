import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import VideoTree from 'components/Video/TreeView/Tree/VideoTree';
import VideoFavorites from 'components/Video/UI/Favorites/VideoFavorites';
import VideoTags from 'components/Video/UI/Tags/VideoTags';
import VideoViews from 'components/Video/UI/Views/VideoViews';
import VideoDuration from 'components/Video/UI/Duration/VideoDuration';
import VideoTimestamp from 'components/Video/UI/Timestamp/VideoTimestamp';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import Loader from 'components/Video/Player/UI/Loader/Loader';
import { useAppThunk } from 'hooks/store-hook';
import { VideoTreeClient } from 'store/slices/video-slice';
import { fetchVideo } from 'store/thunks/video-thunk';
import 'styles/video.scss';

const VideoPage: React.FC = () => {
  const { dispatchThunk, data, loaded } = useAppThunk<VideoTreeClient | null>(
    null
  );

  const { id } = useParams();

  useEffect(() => {
    dispatchThunk(fetchVideo(id!));
  }, [dispatchThunk, id]);

  return (
    <div className="video-page">
      <div className="video-page__video">
        <Loader on={!loaded} />
        {data && <VideoTree tree={data} history={data.history} />}
      </div>
      {data && (
        <div className="video-page__info">
          <div className="video-page__info__header">
            <div className="video-page__title">
              <h2>{data.info.title}</h2>
              <div className="video-page__favorites">
                <VideoFavorites
                  videoId={data._id}
                  favorites={data.data.favorites}
                  isFavorite={data.data.isFavorite}
                  button
                />
              </div>
            </div>
            <div className="video-page__createdAt">
              <VideoTimestamp createdAt={data.createdAt} />
            </div>
          </div>
          <Link
            to={`/channel/${data.info.creator}`}
            className="video-page__creator"
          >
            <Avatar src={data.info.creatorInfo.picture} />
            <h3>{data.info.creatorInfo.name}</h3>
          </Link>
          <VideoTags tags={data.info.tags} />
          <div className="video-page__detail">
            <VideoViews video={data} />
            <VideoDuration
              minDuration={data.info.minDuration}
              maxDuration={data.info.maxDuration}
            />
            <p className="video-page__description">{data.info.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage;
