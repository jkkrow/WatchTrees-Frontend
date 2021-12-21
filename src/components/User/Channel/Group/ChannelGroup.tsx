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
      <ChannelLoaderList loading={!loaded} />
      {loaded && data.length > 0 && (
        <>
          {label && <h3 className="channel-group__label">{label}</h3>}
          <Swiper
            modules={[Navigation]}
            slidesPerView={2}
            slidesPerGroup={2}
            breakpoints={{
              695: { slidesPerView: 3, slidesPerGroup: 3 },
              915: { slidesPerView: 4, slidesPerGroup: 4 },
              1135: { slidesPerView: 5, slidesPerGroup: 5 },
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
