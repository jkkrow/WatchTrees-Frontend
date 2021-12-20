import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Navigation } from 'swiper';

import ChannelInfo from '../Info/ChannelInfo';
import ChannelLoaderList from '../Loader/List/ChannelLoaderList';
import { ChannelData } from 'store/slices/user-slice';
import './ChannelGroup.scss';

interface ChannelGroupProps {
  label?: string;
  onFetch: () => Promise<{ subscribes: ChannelData[] }>;
}

const ChannelGroup: React.FC<ChannelGroupProps> = ({ label, onFetch }) => {
  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const data = await onFetch();

      setChannels(data.subscribes);
      setLoading(false);
    })();
  }, [onFetch]);

  return (
    <div className="channel-group">
      <ChannelLoaderList loading={loading} />
      {!loading && channels.length > 0 && (
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
            {channels.map((channel) => (
              <SwiperSlide key={channel._id}>
                <ChannelInfo data={channel} loading={loading} column button />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
};

export default ChannelGroup;
