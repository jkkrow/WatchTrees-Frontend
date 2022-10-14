import { Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import VideoThumbnail from '../UI/Thumbnail/VideoThumbnail';
import VideoLoader from 'components/Video/Loader/VideoLoader';
import Card from 'components/Common/UI/Card/Card';
import { VideoTreeClient } from 'store/types/video';

import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/scss';
import 'styles/swiper.scss';
import './VideoCarousel.scss';
import VideoDuration from 'components/Video/UI/Duration/VideoDuration';
import VideoCreator from 'components/Video/UI/Creator/VideoCreator';
import { Link } from 'react-router-dom';
import VideoViews from 'components/Video/UI/Views/VideoViews';
import VideoFavorites from 'components/Video/UI/Favorites/VideoFavorites';

interface VideoCarouselProps {
  data: { videos: VideoTreeClient[] };
  loaded: boolean;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ data, loaded }) => {
  return (
    <div className="video-carousel">
      <VideoLoader on={!loaded} />
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
            <SwiperSlide key={video._id} className="video-carousel__slider">
              <VideoThumbnail video={video} />
              <div className="video-carousel__info">
                <Link
                  to={`/video/${video._id}`}
                  className="video-carousel__title"
                >
                  {video.title}
                </Link>
                <div className="video-carousel__creator">
                  <VideoCreator creator={video.creator} />
                </div>
                <div className="video-carousel__duration">
                  <VideoDuration
                    brief
                    minDuration={video.minDuration}
                    maxDuration={video.maxDuration}
                  />
                </div>
                <div className="video-carousel__data">
                  <VideoViews views={video.views} brief />
                  <VideoFavorites
                    videoId={video._id}
                    favorites={video.favorites}
                    isFavorite={video.isFavorite}
                  />
                </div>
                <div className="video-carousel__description">
                  {video.description}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Card>
    </div>
  );
};

export default VideoCarousel;
