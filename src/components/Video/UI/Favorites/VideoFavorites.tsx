import { ReactComponent as FavoriteIcon } from 'assets/icons/favorite.svg';
import { formatNumber } from 'util/format';
import './VideoFavorites.scss';

interface VideoFavoritesProps {
  favorites: number;
  active?: boolean;
  onClick?: () => void;
}

const VideoFavorites: React.FC<VideoFavoritesProps> = ({
  favorites,
  active = false,
  onClick,
}) => {
  return (
    <div
      className={`video-favorites${onClick ? ' button' : ''}${
        active ? ' active' : ''
      }`}
    >
      <FavoriteIcon onClick={onClick} />
      <span>{formatNumber(favorites)}</span>
    </div>
  );
};

export default VideoFavorites;
