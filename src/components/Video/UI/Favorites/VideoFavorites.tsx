import { ReactComponent as FavoriteIcon } from 'assets/icons/favorite.svg';
import { VideoTree } from 'store/slices/video-slice';
import { formatNumber } from 'util/format';
import './VideoFavorites.scss';

interface VideoFavoritesProps {
  video: VideoTree;
  active?: boolean;
  onClick?: () => void;
}

const VideoFavorites: React.FC<VideoFavoritesProps> = ({
  video,
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
      <span>{formatNumber(video.data.favorites)}</span>
    </div>
  );
};

export default VideoFavorites;
