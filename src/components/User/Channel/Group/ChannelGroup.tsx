import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Navigation } from 'swiper';

import ChannelInfo from '../Info/ChannelInfo';
import ChannelLoaderList from '../Loader/List/ChannelLoaderList';
import { AppThunk } from 'store';
import { useAppDispatch } from 'hooks/store-hook';
import { ChannelData } from 'store/slices/user-slice';
import './ChannelGroup.scss';

const INITIAL_WIDTH = 680;
const ITEM_WIDTH = 200;

interface ChannelGroupProps {
  label?: string;
  forceUpdate?: boolean;
  onFetch: ReturnType<AppThunk>;
}

const ChannelGroup: React.FC<ChannelGroupProps> = ({
  label,
  forceUpdate,
  onFetch,
}) => {
  const { dispatchThunk, data, loaded } = useAppDispatch<ChannelData[]>([]);

  const history = useHistory();

  useEffect(() => {
    dispatchThunk(onFetch({}, forceUpdate || history.action !== 'POP'));
  }, [dispatchThunk, onFetch, history, forceUpdate]);

  return (
    <div className="channel-group">
      {label && (
        <h3 className={`channel-group__label${!loaded ? ' loading' : ''}`}>
          {label}
        </h3>
      )}
      <ChannelLoaderList loading={!loaded} />
      {loaded && data.length > 0 && (
        <>
          <Swiper
            modules={[Navigation]}
            slidesPerView={2}
            slidesPerGroup={2}
            breakpoints={{
              [INITIAL_WIDTH]: { slidesPerView: 3, slidesPerGroup: 3 },
              [INITIAL_WIDTH + ITEM_WIDTH]: {
                slidesPerView: 4,
                slidesPerGroup: 4,
              },
              [INITIAL_WIDTH + ITEM_WIDTH * 2]: {
                slidesPerView: 5,
                slidesPerGroup: 5,
              },
              [INITIAL_WIDTH + ITEM_WIDTH * 3]: {
                slidesPerView: 6,
                slidesPerGroup: 6,
              },
              [INITIAL_WIDTH + ITEM_WIDTH * 4]: {
                slidesPerView: 7,
                slidesPerGroup: 7,
              },
            }}
            spaceBetween={20}
            navigation
          >
            {data.map((channel) => (
              <SwiperSlide key={channel._id}>
                <ChannelInfo data={channel} loading={!loaded} column button />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
};

export default ChannelGroup;
