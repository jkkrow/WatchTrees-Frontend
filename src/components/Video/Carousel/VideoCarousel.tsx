import { useEffect } from 'react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import VideoThumbnail from '../UI/Thumbnail/VideoThumbnail';
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
import VideoDuration from 'components/Video/UI/Duration/VideoDuration';
import VideoCreator from 'components/Video/UI/Creator/VideoCreator';
import { Link } from 'react-router-dom';
import VideoViews from 'components/Video/UI/Views/VideoViews';
import VideoFavorites from 'components/Video/UI/Favorites/VideoFavorites';

const CAROUSEL_VIDEOS_NUMBER = 5;

const VideoCarousel: React.FC = () => {
  const { dispatchThunk, data, loaded } = useAppThunk<{
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
      <VideoLoader on={!loaded} />
      {loaded && data.videos.length > 0 && (
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
                    {video.info.title}
                  </Link>
                  <div className="video-carousel__creator">
                    <VideoCreator info={video.info} />
                  </div>
                  <div className="video-carousel__duration">
                    <VideoDuration
                      brief
                      minDuration={video.info.minDuration}
                      maxDuration={video.info.maxDuration}
                    />
                  </div>
                  <div className="video-carousel__data">
                    <VideoViews views={video.data.views} brief />
                    <VideoFavorites
                      videoId={video._id}
                      favorites={video.data.favorites}
                      isFavorite={video.data.isFavorite}
                    />
                  </div>
                  <div className="video-carousel__description">
                    {video.info.description}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Card>
      )}
    </div>
  );
};

export default VideoCarousel;
