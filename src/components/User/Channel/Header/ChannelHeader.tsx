import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ChannelInfo from '../Info/ChannelInfo';
import { useAppDispatch } from 'hooks/store-hook';
import { ChannelData } from 'store/slices/user-slice';
import { fetchChannel } from 'store/thunks/user-thunk';
import './ChannelHeader.scss';

const ChannelHeader: React.FC = () => {
  const { dispatchThunk, data, loaded } = useAppDispatch<ChannelData | null>(
    null
  );

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    dispatchThunk(fetchChannel(id));
  }, [dispatchThunk, id]);

  return (
    <div className="channel-header">
      <ChannelInfo data={data} loading={!loaded} />
    </div>
  );
};

export default ChannelHeader;
