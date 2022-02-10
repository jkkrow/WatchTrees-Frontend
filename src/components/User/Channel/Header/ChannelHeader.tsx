import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ChannelItem from '../Item/ChannelItem';
import { useAppThunk } from 'hooks/store-hook';
import { ChannelData } from 'store/slices/user-slice';
import { fetchChannel } from 'store/thunks/user-thunk';
import './ChannelHeader.scss';

const ChannelHeader: React.FC = () => {
  const { dispatchThunk, data, loading, loaded } =
    useAppThunk<ChannelData | null>(null);

  const { id } = useParams();

  useEffect(() => {
    dispatchThunk(fetchChannel(id!));
  }, [dispatchThunk, id]);

  return (
    <div className={`channel-header${!loaded ? ' loading' : ''}`}>
      <ChannelItem data={data} loading={loading} />
    </div>
  );
};

export default ChannelHeader;
