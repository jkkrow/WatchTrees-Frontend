import ChannelItem from '../Item/ChannelItem';
import ChannelLoader from '../Loader/ChannelLoader';
import LoaderGrid from 'components/Common/UI/Loader/Grid/LoaderGrid';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import NotFound from 'components/Common/UI/NotFound/NotFound';
import { ReactComponent as SubscribeUserIcon } from 'assets/icons/subscribe-users.svg';
import { ChannelData } from 'store/types/user';
import './ChannelGrid.scss';

interface ChannelGridProps {
  data: { channels: ChannelData[]; count: number };
  loading: boolean;
  loaded: boolean;
  currentPage: number;
  pageSize: number;
  keyword?: string;
  label?: string;
}

const ChannelGrid: React.FC<ChannelGridProps> = ({
  data,
  loading,
  loaded,
  currentPage,
  pageSize,
  keyword,
  label,
}) => {
  return (
    <div className="channel-grid">
      {label && (
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
        {data.channels.map((item) => (
          <ChannelItem key={item._id} data={item} button />
        ))}
      </div>
      {!loading && loaded && !data.channels.length && (
        <NotFound
          text={`No ${label || 'channel found'}`}
          icon={<SubscribeUserIcon />}
        />
      )}
      {loaded && (
        <Pagination
          count={data.count}
          currentPage={currentPage}
          pageSize={pageSize}
          keyword={keyword}
        />
      )}
    </div>
  );
};

export default ChannelGrid;
