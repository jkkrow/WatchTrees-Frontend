import MyVideoItem from '../Item/CreatedVideoItem';
import LoaderGrid from 'components/Common/UI/Loader/Grid/LoaderGrid';
import VideoLoader from 'components/Video/Loader/VideoLoader';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import NotFound from 'components/Common/UI/NotFound/NotFound';
import { ReactComponent as VideoIcon } from 'assets/icons/video.svg';
import { VideoTreeClient } from 'store/slices/video-slice';
import './CreatedVideoGrid.scss';

interface CreatedVideoGridProps {
  data: { videos: VideoTreeClient[]; count: number };
  loading: boolean;
  loaded: boolean;
  currentPage: number;
  pageSize: number;
  onDelete: (item: VideoTreeClient) => void;
}

const CreatedVideoGrid: React.FC<CreatedVideoGridProps> = ({
  data,
  loading,
  loaded,
  currentPage,
  pageSize,
  onDelete,
}) => {
  return (
    <div className="created-video-grid">
      <LoaderGrid
        className="created-video-grid__loader"
        loading={!loaded}
        loader={<VideoLoader detail />}
        rows={3}
      />
      <div className="created-video-grid__container">
        <LoadingSpinner on={loaded && loading} overlay />
        {data.videos.map((item) => (
          <MyVideoItem key={item._id} item={item} onDelete={onDelete} />
        ))}
      </div>
      {!loading && loaded && !data.videos.length && (
        <NotFound text="No Video" icon={<VideoIcon />} />
      )}
      {loaded && (
        <Pagination
          count={data.count}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default CreatedVideoGrid;
