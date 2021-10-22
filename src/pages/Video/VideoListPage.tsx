import VideoCarousel from "components/Video/Carousel/VideoCarousel";
import VideoList from "components/Video/List/VideoList";

const VideoListPage = () => {
  return (
    <div className="layout">
      <VideoCarousel />
      <VideoList />
    </div>
  );
};

export default VideoListPage;
