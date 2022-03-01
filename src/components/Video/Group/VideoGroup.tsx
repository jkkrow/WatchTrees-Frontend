import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import VideoItem from 'components/Video/Item/VideoItem';
import LoaderGrid from 'components/Common/UI/Loader/Grid/LoaderGrid';
import VideoLoader from 'components/Video/Loader/VideoLoader';
import { VideoTreeClient } from 'store/slices/video-slice';

import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/scss';
import 'styles/swiper.scss';
import './VideoGroup.scss';

interface VideoGroupProps {
  data: { videos: VideoTreeClient[] };
  loaded: boolean;
  id?: 'history' | 'favorites';
  label?: string;
  to?: string;
}

const VideoGroup: React.FC<VideoGroupProps> = ({
  data,
  loaded,
  id,
  label,
  to,
}) => {
  const [videos, setVideos] = useState(data.videos);

  useEffect(() => {
    setVideos(data.videos);
  }, [data.videos]);

  const filterList = useCallback(
    (videoId: string) => {
      setVideos((prev) => prev.filter((video) => video._id !== videoId));
    },
    [setVideos]
  );

  return !loaded || videos.length > 0 ? (
    <div className="video-group">
      {label && (
        <h3 className={`video-group__label${!loaded ? ' loading' : ''}`}>
          {to ? <Link to={to}>{label}</Link> : label}
        </h3>
      )}
      <LoaderGrid
        className="video-group__loader"
        loading={!loaded}
        loader={<VideoLoader detail />}
      />
      <Swiper
        className="video-group__slider"
        modules={[Navigation]}
        slidesPerView={2}
        slidesPerGroup={2}
        breakpoints={{
          1114: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          1374: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
        }}
        spaceBetween={20}
        navigation
      >
        {videos.map((video) => (
          <SwiperSlide key={video._id}>
            <VideoItem id={id} video={video} onDelete={filterList} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  ) : null;
};

export default VideoGroup;
