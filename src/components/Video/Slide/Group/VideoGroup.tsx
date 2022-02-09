import { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import VideoItem from 'components/Video/Item/VideoItem';
import VideoLoaderList from 'components/Video/Loader/List/VideoLoaderList';
import { useAppThunk } from 'hooks/store-hook';
import { AppThunk } from 'store';
import { VideoTreeClient } from 'store/slices/video-slice';

import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/scss';
import 'styles/swiper.scss';
import './VideoGroup.scss';

const INITIAL_WIDTH = 678;
const ITEM_WIDTH = 320;

interface VideoGroupProps {
  max?: number;
  skipFullyWatched?: boolean;
  id?: 'history' | 'favorites';
  label?: string;
  to?: string;
  forceUpdate?: boolean;
  onFetch: ReturnType<AppThunk>;
}

const VideoGroup: React.FC<VideoGroupProps> = ({
  id,
  label,
  to,
  max = 10,
  skipFullyWatched = false,
  forceUpdate,
  onFetch,
}) => {
  const { dispatchThunk, setData, data, loading } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({ videos: [], count: 0 }, { forceUpdate });

  useEffect(() => {
    dispatchThunk(onFetch({ max, skipFullyWatched }));
  }, [dispatchThunk, onFetch, max, skipFullyWatched]);

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
      {label &&
        (loading || data.videos.length > 0) &&
        (loading ? (
          <h3 className="video-group__label loading">{label}</h3>
        ) : (
          <h3 className="video-group__label">
            {to ? <Link to={to}>{label}</Link> : { label }}
          </h3>
        ))}
      <VideoLoaderList loading={loading} />
      {!loading && data.videos.length > 0 && (
        <Swiper
          modules={[Navigation]}
          slidesPerView={2}
          slidesPerGroup={2}
          breakpoints={{
            [INITIAL_WIDTH + ITEM_WIDTH]: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
            [INITIAL_WIDTH + ITEM_WIDTH * 2]: {
              slidesPerView: 4,
              slidesPerGroup: 4,
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
