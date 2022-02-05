import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ChannelInfo from '../Info/ChannelInfo';
import { useAppThunk } from 'hooks/store-hook';
import { ChannelData } from 'store/slices/user-slice';
import { fetchChannelInfo } from 'store/thunks/user-thunk';
import './ChannelHeader.scss';

const ChannelHeader: React.FC = () => {
  const { dispatchThunk, data, loaded } = useAppThunk<ChannelData | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    dispatchThunk(fetchChannelInfo(id));
  }, [dispatchThunk, id]);

  return (
    <div className="channel-header">
      <ChannelInfo data={data} loading={!loaded} />
    </div>
  );
};

export default ChannelHeader;
