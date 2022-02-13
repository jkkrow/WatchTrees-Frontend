import { useEffect } from 'react';

import ChannelItem from '../Item/ChannelItem';
import ChannelLoader from '../Loader/ChannelLoader';
import LoaderList from 'components/Common/UI/Loader/List/LoaderList';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import { usePaginate } from 'hooks/page-hook';
import { useSearch } from 'hooks/search-hook';
import { useAppThunk } from 'hooks/store-hook';
import { AppThunk } from 'store';
import { ChannelData } from 'store/slices/user-slice';
import './ChannelList.scss';

interface ChannelListProps {
  label?: string;
  max?: number;
  onFetch: ReturnType<AppThunk>;
}

const ChannelList: React.FC<ChannelListProps> = ({
  label,
  max = 12,
  onFetch,
}) => {
  const { dispatchThunk, data, loading, loaded } = useAppThunk<{
    channels: ChannelData[];
    count: number;
  }>({ channels: [], count: 0 });

  const { currentPage, itemsPerPage } = usePaginate(max);
  const { keyword } = useSearch();

  useEffect(() => {
    dispatchThunk(
      onFetch({ page: currentPage, max: itemsPerPage, search: keyword })
    );
  }, [dispatchThunk, currentPage, itemsPerPage, keyword, onFetch]);

  return (
    <div className="channel-list">
      {label && (!loaded || data.channels.length > 0) && (
        <h3 className={`channel-list__label${!loaded ? ' loading' : ''}`}>
          {label}
        </h3>
      )}
      <LoaderList
        className="channel-list__loader"
        loading={!loaded}
        loader={<ChannelLoader />}
        rows={3}
      />
      <div className="channel-list__container">
        <LoadingSpinner on={loaded && loading} overlay />
        {loaded &&
          data.channels.length > 0 &&
          data.channels.map((item) => (
            <ChannelItem key={item._id} data={item} button />
          ))}
      </div>
      {!loading && loaded && !data.channels.length && (
        <div className="channel-list__empty">No {label || 'channel found'}</div>
      )}
      {loaded && (
        <Pagination
          count={data.count}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          keyword={keyword}
        />
      )}
    </div>
  );
};

export default ChannelList;
