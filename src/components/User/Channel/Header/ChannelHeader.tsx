import { useEffect, useState } from 'react';

import ChannelInfo from '../Info/ChannelInfo';
import { useAppDispatch } from 'hooks/store-hook';
import { ChannelData } from 'store/slices/user-slice';
import { fetchChannel } from 'store/thunks/user-thunk';
import './ChannelHeader.scss';

interface ChannelHeaderProps {
  channelId: string;
}

const ChannelHeader: React.FC<ChannelHeaderProps> = ({ channelId }) => {
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      setLoading(true);

      const detail = await dispatch(fetchChannel(channelId));

      setChannelData(detail);
      setLoading(false);
    })();
  }, [dispatch, channelId]);

  return (
    <div className="channel-header">
      <ChannelInfo data={channelData} loading={loading} />
    </div>
  );
};

export default ChannelHeader;
