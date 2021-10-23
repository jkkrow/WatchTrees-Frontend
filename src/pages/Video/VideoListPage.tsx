import VideoCarousel from 'components/Video/Carousel/VideoCarousel';
import VideoList from 'components/Video/List/VideoList';

const VideoListPage: React.FC = () => {
  return (
    <div className="layout">
      <VideoCarousel />
      <VideoList />
    </div>
  );
};

export default VideoListPage;
