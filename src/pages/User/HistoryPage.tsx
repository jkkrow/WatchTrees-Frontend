import VideoList from 'components/Video/List/VideoList';
import { fetchHistory } from 'store/thunks/user-thunk';

const HistoryPage: React.FC = () => {
  return (
    <div className="layout">
      <VideoList label="Watch History" forceUpdate onFetch={fetchHistory} />
    </div>
  );
};

export default HistoryPage;
