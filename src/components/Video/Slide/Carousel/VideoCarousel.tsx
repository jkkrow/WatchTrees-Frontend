import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Navigation, Pagination, Autoplay } from 'swiper';

import VideoThumbnail from '../../UI/Thumbnail/VideoThumbnail';
import VideoLoaderItem from 'components/Video/Loader/Item/VideoLoaderItem';
import { useAppDispatch } from 'hooks/store-hook';
import { VideoItemDetail } from 'store/slices/video-slice';
import { fetchVideos } from 'store/thunks/video-thunk';
import './VideoCarousel.scss';

import 'swiper/swiper.scss';
import 'swiper/modules/pagination/pagination.min.css';
import 'swiper/modules/navigation/navigation.min.css';

const CAROUSEL_VIDEOS_NUMBER = 5;

const VideoCarousel: React.FC = () => {
  const { dispatchThunk, data, loaded } = useAppDispatch<{
    videos: VideoItemDetail[];
    count: number;
  }>({
    videos: [],
    count: 0,
  });

  const history = useHistory();

  useEffect(() => {
    dispatchThunk(
      fetchVideos({ max: CAROUSEL_VIDEOS_NUMBER }, history.action !== 'POP')
    );
  }, [dispatchThunk, history]);

  return (
    <div className="video-carousel">
      <VideoLoaderItem on={!loaded} />
      {loaded && data.videos.length > 0 && (
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
      )}
    </div>
  );
};

export default VideoCarousel;
