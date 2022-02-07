import VideoList from 'components/Video/List/VideoList';
import { fetchHistory } from 'store/thunks/video-thunk';
import 'styles/video.scss';

const HistoryPage: React.FC = () => {
  return (
    <div className="videos-page">
      <VideoList
        id="history"
        label="Watch History"
        forceUpdate
        onFetch={fetchHistory}
      />
    </div>
  );
};

export default HistoryPage;
