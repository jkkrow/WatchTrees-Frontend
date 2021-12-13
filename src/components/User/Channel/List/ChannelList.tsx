import { useEffect, useRef, useState } from 'react';

import ChannelInfo from '../Info/ChannelInfo';
import ChannelLoader from 'components/Common/UI/Loader/Channel/ChannelLoader';
import { ChannelData } from 'store/slices/user-slice';
import './ChannelList.scss';

interface ChannelListProps {
  list: ChannelData[];
  loading: boolean;
}

const ChannelList: React.FC<ChannelListProps> = ({ list, loading }) => {
  const [loaders, setLoaders] = useState<undefined[]>([]);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listWidth = listRef.current!.offsetWidth;
    const rows = Math.floor(listWidth / 250);

    setLoaders(Array.from(Array(rows)));
  }, []);

  return (
    <div className="channel-list" ref={listRef}>
      <ul className="channel-list__list">
        {loading &&
          loaders.map((_, index) => (
            <div key={index} className="channel-list__loader">
              <ChannelLoader on={loading} column />
            </div>
          ))}
        {!loading &&
          list.map((data) => (
            <li key={data._id} className="channel-list__item">
              <ChannelInfo data={data} loading={loading} column button />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ChannelList;
