import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Navigation } from 'swiper';

import VideoItem from 'components/Video/Item/VideoItem';
import VideoLoaderList from 'components/Video/Loader/List/VideoLoaderList';
import { useAppSelector } from 'hooks/store-hook';
import { VideoListDetail } from 'store/slices/video-slice';
import './VideoGroup.scss';

import 'swiper/swiper.scss';
import 'swiper/modules/navigation/navigation.min.css';

interface VideoGroupProps {
  label?: string;
  onFetch: (forceUpdate: boolean) => Promise<VideoListDetail[]>;
}

const VideoGroup: React.FC<VideoGroupProps> = ({ label, onFetch }) => {
  const { refreshToken, accessToken } = useAppSelector((state) => state.auth);

  const [videos, setVideos] = useState<VideoListDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (refreshToken && !accessToken) return;

      setLoading(true);

      const videos = await onFetch(history.action !== 'POP');

      if (videos) {
        setVideos(videos);
      }

      setLoading(false);
    })();
  }, [refreshToken, accessToken, history, onFetch]);

  return (
    <div className="video-group">
      <VideoLoaderList loading={loading} />

      {!loading && videos.length > 0 && (
        <div className="video-group__slides">
          {label && <h3 className="video-group__label">{label}</h3>}
          <Swiper
            modules={[Navigation]}
            className="video-group__swiper"
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
            {videos.map((video) => (
              <SwiperSlide key={video._id}>
                <VideoItem video={video} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default VideoGroup;
