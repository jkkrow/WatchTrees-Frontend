import { useEffect } from 'react';
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

interface VideoGroupProps {
  params?: { max: number; skipFullyWatched: boolean };
  label?: string;
  to?: string;
  forceUpdate?: boolean;
  onFetch: ReturnType<AppThunk>;
}

const VideoGroup: React.FC<VideoGroupProps> = ({
  params = { max: 10 },
  label,
  to,
  forceUpdate,
  onFetch,
}) => {
  const { refreshToken, accessToken } = useAppSelector((state) => state.auth);
  const { dispatchThunk, data, loaded } = useAppDispatch<{
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

  return (
    <div className="video-group">
      <VideoLoaderList loading={!loaded} />

      {loaded && data.videos.length > 0 && (
        <>
          {label && (
            <h3
              className={`video-group__label${to ? ' link' : ''}`}
              onClick={() => to && history.push(to)}
            >
              {label}
            </h3>
          )}
          <Swiper
            modules={[Navigation]}
            breakpoints={{
              675: { slidesPerView: 2, slidesPerGroup: 2 },
              995: { slidesPerView: 3, slidesPerGroup: 3 },
              1315: { slidesPerView: 4, slidesPerGroup: 4 },
              1635: { slidesPerView: 5, slidesPerGroup: 5 },
              1955: { slidesPerView: 6, slidesPerGroup: 6 },
            }}
            spaceBetween={20}
            navigation
          >
            {data.videos.map((video) => (
              <SwiperSlide key={video._id}>
                <VideoItem video={video} />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
};

export default VideoGroup;
