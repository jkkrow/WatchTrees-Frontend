import VideoCarousel from 'components/Video/Slide/Carousel/VideoCarousel';
import VideoGroup from 'components/Video/Slide/Group/VideoGroup';
import VideoList from 'components/Video/List/VideoList';
import { useSearch } from 'hooks/search-hook';
import { fetchVideos } from 'store/thunks/video-thunk';
import { fetchHistory } from 'store/thunks/user-thunk';

const VideoListPage: React.FC = () => {
  const { keyword } = useSearch();

  return (
    <div className="layout">
      {!keyword && (
        <>
          <VideoCarousel />
          <VideoGroup
            label="Recently Watched"
            params={{ max: 10, skipFullyWatched: true }}
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
