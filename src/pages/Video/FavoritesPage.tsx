import VideoList from 'components/Video/List/VideoList';
import { fetchFavorites } from 'store/thunks/video-thunk';
import 'styles/video.scss';

const FavoritesPage: React.FC = () => {
  return (
    <div className="videos-page">
      <VideoList
        id="favorites"
        label="Favorite Videos"
        onFetch={fetchFavorites}
      />
    </div>
  );
};

export default FavoritesPage;
