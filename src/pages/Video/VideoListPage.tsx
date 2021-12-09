import VideoCarousel from 'components/Video/Carousel/VideoCarousel';
import VideoList from 'components/Video/List/VideoList';
import { useSearch } from 'hooks/search-hook';

const VideoListPage: React.FC = () => {
  const { keyword } = useSearch();

  return (
    <div className="layout">
      {!keyword && <VideoCarousel />}
      <VideoList />
    </div>
  );
};

export default VideoListPage;
