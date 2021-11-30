import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router';

import LoadingCard from 'components/Common/UI/Loader/Card/LoadingCard';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import { ReactComponent as AngleRightIcon } from 'assets/icons/angle-right.svg';
import { useInterval } from 'hooks/timer-hook';
import { useAppDispatch } from 'hooks/store-hook';
import { VideoTree } from 'store/slices/video-slice';
import { fetchVideos } from 'store/thunks/video-thunk';
import { thumbanilUrl } from 'util/video';
import './VideoCarousel.scss';

const CAROUSEL_VIDEOS_NUMBER = 5;

const VideoCarousel: React.FC = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<VideoTree[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateAmount, setTranslateAmount] = useState('0%');

  const [carouselInterval, clearCarouselInterval] = useInterval();

  const history = useHistory();

  const navigateHandler = useCallback(
    (direction: 1 | -1) => {
      if (direction === -1) {
        currentIndex !== 0
          ? setCurrentIndex((prev) => prev - 1)
          : setCurrentIndex(videos.length - 1);
      }

      if (direction === 1) {
        currentIndex !== videos.length - 1
          ? setCurrentIndex((prev) => prev + 1)
          : setCurrentIndex(0);
      }
    },
    [currentIndex, videos.length]
  );

  const intervalHandler = useCallback(() => {
    carouselInterval(() => navigateHandler(1), 3000);
  }, [carouselInterval, navigateHandler]);

  useEffect(() => {
    intervalHandler();
  }, [intervalHandler]);

  useEffect(() => {
    const amount = `${currentIndex * (100 / videos.length)}%`;

    setTranslateAmount(`-${amount}`);
  }, [currentIndex, videos.length]);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { videos } = await dispatch(
        fetchVideos(
          {
            max: CAROUSEL_VIDEOS_NUMBER,
            count: false,
          },
          history.action !== 'POP'
        )
      );

      setVideos(videos);
      setLoading(false);
    })();
  }, [dispatch, history]);

  return (
    <div className="video-carousel">
      <LoadingCard on={loading} />
      {!loading && videos.length > 0 && (
        <div
          className="video-carousel__container"
          onMouseOver={() => clearCarouselInterval()}
          onMouseOut={() => intervalHandler()}
        >
          <ul
            className="video-carousel__list"
            style={{ transform: `translateX(${translateAmount})` }}
          >
            {videos.map((item) => (
              <li key={item._id} className="video-carousel__item">
                <img src={thumbanilUrl(item)} alt={item.title} />
              </li>
            ))}
          </ul>
          {videos.length > 1 && (
            <>
              <div
                className="video-carousel__arrow left"
                onClick={() => navigateHandler(-1)}
              >
                <AngleLeftIcon />
              </div>
              <div
                className="video-carousel__arrow right"
                onClick={() => navigateHandler(1)}
              >
                <AngleRightIcon />
              </div>
              <div className="video-carousel__navigation">
                <ul className="video-carousel__navigation__list">
                  {videos.map((item, index) => (
                    <li
                      key={item._id}
                      className={`video-carousel__navigation__item link${
                        index === currentIndex ? ' active' : ''
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoCarousel;
