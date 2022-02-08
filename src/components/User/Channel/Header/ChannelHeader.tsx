import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ChannelInfo from '../Info/ChannelInfo';
import { useAppThunk } from 'hooks/store-hook';
import { ChannelData } from 'store/slices/user-slice';
import { fetchChannelInfo } from 'store/thunks/user-thunk';
import './ChannelHeader.scss';

const ChannelHeader: React.FC = () => {
  const { dispatchThunk, data, loading, loaded } =
    useAppThunk<ChannelData | null>(null);

  const { id } = useParams();

  useEffect(() => {
    dispatchThunk(fetchChannelInfo(id!));
  }, [dispatchThunk, id]);

  return (
    <div className={`channel-header${!loaded ? ' loading' : ''}`}>
      <ChannelInfo data={data} loading={loading} />
    </div>
  );
};

export default ChannelHeader;
