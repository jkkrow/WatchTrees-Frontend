import { useEffect } from 'react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import VideoThumbnail from '../../UI/Thumbnail/VideoThumbnail';
import VideoLoader from 'components/Video/Loader/VideoLoader';
import Card from 'components/Common/UI/Card/Card';
import { useAppThunk } from 'hooks/store-hook';
import { VideoTreeClient } from 'store/slices/video-slice';
import { fetchVideos } from 'store/thunks/video-thunk';

import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/scss';
import 'styles/swiper.scss';
import './VideoCarousel.scss';

const CAROUSEL_VIDEOS_NUMBER = 5;

const VideoCarousel: React.FC = () => {
  const { dispatchThunk, data, loading } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({
    videos: [],
    count: 0,
  });

  useEffect(() => {
    dispatchThunk(fetchVideos({ max: CAROUSEL_VIDEOS_NUMBER }));
  }, [dispatchThunk]);

  return (
    <div className="video-carousel">
      <VideoLoader on={loading} />
      {!loading && data.videos.length > 0 && (
        <Card>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            }}
            speed={700}
            navigation
            loop
          >
            {data.videos.map((video) => (
              <SwiperSlide key={video._id}>
                <VideoThumbnail video={video} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Card>
      )}
    </div>
  );
};

export default VideoCarousel;
