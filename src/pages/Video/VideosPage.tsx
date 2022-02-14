import VideoCarousel from 'components/Video/Slide/Carousel/VideoCarousel';
import VideoGroup from 'components/Video/Slide/Group/VideoGroup';
import VideoList from 'components/Video/List/VideoList';
import { useSearch } from 'hooks/search-hook';
import { fetchVideos, fetchHistory } from 'store/thunks/video-thunk';
import 'styles/video.scss';

const VideoListPage: React.FC = () => {
  const { keyword } = useSearch();

  return (
    <div className="videos-page">
      {!keyword && (
        <>
          <VideoCarousel />
          <VideoGroup
            id="history"
            label="Recently Watched"
            to="/history"
            skipFullyWatched
            forceUpdate
            onFetch={fetchHistory}
          />
        </>
      )}
      {keyword && <h2>Tag: #{keyword}</h2>}
      <VideoList
        label={!keyword ? 'Recent Videos' : undefined}
        onFetch={fetchVideos}
      />
    </div>
  );
};

export default VideoListPage;
