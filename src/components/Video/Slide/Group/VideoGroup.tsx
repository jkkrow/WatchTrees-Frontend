import { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Navigation } from 'swiper';

import VideoItem from 'components/Video/Item/VideoItem';
import VideoLoaderList from 'components/Video/Loader/List/VideoLoaderList';
import { useAppSelector, useAppDispatch } from 'hooks/store-hook';
import { AppThunk } from 'store';
import { VideoListDetail } from 'store/slices/video-slice';
import './VideoGroup.scss';

import 'swiper/swiper.scss';
import 'swiper/modules/navigation/navigation.min.css';

const INITIAL_WIDTH = 660;
const ITEM_WIDTH = 320;

interface VideoGroupProps {
  params?: { max: number; skipFullyWatched: boolean };
  id?: 'history' | 'favorites';
  label?: string;
  to?: string;
  forceUpdate?: boolean;
  onFetch: ReturnType<AppThunk>;
}

const VideoGroup: React.FC<VideoGroupProps> = ({
  params = { max: 10 },
  id,
  label,
  to,
  forceUpdate,
  onFetch,
}) => {
  const { refreshToken, accessToken } = useAppSelector((state) => state.auth);
  const { dispatchThunk, data, setData, loaded } = useAppDispatch<{
    videos: VideoListDetail[];
    count: number;
  }>({ videos: [], count: 0 });

  const history = useHistory();

  useEffect(() => {
    if (refreshToken && !accessToken) return;

    dispatchThunk(onFetch(params, forceUpdate || history.action !== 'POP'));
  }, [
    dispatchThunk,
    refreshToken,
    accessToken,
    history,
    onFetch,
    params,
    forceUpdate,
  ]);

  const filterList = useCallback(
    (videoId: string) => {
      setData((prevData) => ({
        videos: prevData.videos.filter((video) => video._id !== videoId),
        count: prevData.count--,
      }));
    },
    [setData]
  );

  return (
    <div className="video-group">
      {label && (
        <h3
          className={`video-group__label${to ? ' link' : ''}${
            !loaded ? ' loading' : ''
          }`}
          onClick={() => to && history.push(to)}
        >
          {label}
        </h3>
      )}
      <VideoLoaderList loading={!loaded} />
      {loaded && data.videos.length > 0 && (
        <Swiper
          modules={[Navigation]}
          breakpoints={{
            [INITIAL_WIDTH]: { slidesPerView: 2, slidesPerGroup: 2 },
            [INITIAL_WIDTH + ITEM_WIDTH]: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
            [INITIAL_WIDTH + ITEM_WIDTH * 2]: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
            [INITIAL_WIDTH + ITEM_WIDTH * 3]: {
              slidesPerView: 5,
              slidesPerGroup: 5,
            },
            [INITIAL_WIDTH + ITEM_WIDTH * 4]: {
              slidesPerView: 6,
              slidesPerGroup: 6,
            },
          }}
          spaceBetween={20}
          navigation
        >
          {data.videos.map((video) => (
            <SwiperSlide key={video._id}>
              <VideoItem id={id} video={video} onDelete={filterList} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default VideoGroup;
