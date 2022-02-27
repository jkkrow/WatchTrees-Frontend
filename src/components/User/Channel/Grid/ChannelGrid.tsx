import { useEffect } from 'react';

import ChannelItem from '../Item/ChannelItem';
import ChannelLoader from '../Loader/ChannelLoader';
import LoaderGrid from 'components/Common/UI/Loader/Grid/LoaderGrid';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import { usePaginate } from 'hooks/page-hook';
import { useSearch } from 'hooks/search-hook';
import { useAppThunk } from 'hooks/store-hook';
import { AppThunk } from 'store';
import { ChannelData } from 'store/slices/user-slice';
import './ChannelGrid.scss';

interface ChannelGridProps {
  label?: string;
  max?: number;
  onFetch: ReturnType<AppThunk>;
}

const ChannelGrid: React.FC<ChannelGridProps> = ({
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
    <div className="channel-grid">
      {label && (!loaded || data.channels.length > 0) && (
        <h3 className={`channel-grid__label${!loaded ? ' loading' : ''}`}>
          {label}
        </h3>
      )}
      <LoaderGrid
        className="channel-grid__loader"
        loading={!loaded}
        loader={<ChannelLoader />}
        rows={3}
      />
      <div className="channel-grid__container">
        <LoadingSpinner on={loaded && loading} overlay />
        {loaded &&
          data.channels.length > 0 &&
          data.channels.map((item) => (
            <ChannelItem key={item._id} data={item} button />
          ))}
      </div>
      {!loading && loaded && !data.channels.length && (
        <div className="channel-grid__empty">No {label || 'channel found'}</div>
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

export default ChannelGrid;
