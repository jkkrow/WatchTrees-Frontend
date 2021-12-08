import VideoThumbnail from 'components/Video/UI/Thumbnail/VideoThumbnail';
import VideoViews from 'components/Video/UI/Views/VideoViews';
import VideoFavorites from 'components/Video/UI/Favorites/VideoFavorites';
import VideoDuration from 'components/Video/UI/Duration/VideoDuration';
import VideoStatus from 'components/Video/UI/Status/VideoStatus';
import VideoTags from 'components/Video/UI/Tags/VideoTags';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { VideoTree } from 'store/slices/video-slice';
import './UserVideoItem.scss';

interface UserVideoItemProps {
  item: VideoTree;
  onEdit: () => void;
  onDelete: (item: VideoTree) => void;
}

const UserVideoItem: React.FC<UserVideoItemProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  return (
    <li className="user-video-item">
      <div className="user-video-item__thumbnail">
        <VideoThumbnail video={item} />
      </div>
      <div className="user-video-item__info">
        <h3 className="user-video-item__info__title">
          {item.info.title || '_'}
        </h3>
        <div className="user-video-item__info__tags">
          <VideoTags tags={item.info.tags} />
        </div>
        <div className="user-video-item__info__status">
          <VideoStatus video={item} brief />
        </div>
        <div className="user-video-item__info__duration">
          <VideoDuration video={item} brief />
        </div>
        <div className="user-video-item__info__data">
          <VideoViews video={item} brief />
          <VideoFavorites video={item} />
        </div>
        <div>{new Date(item.createdAt).toLocaleDateString()}</div>
        <div className="user-video-item__buttons">
          <EditIcon onClick={onEdit} />
          <DeleteIcon onClick={() => onDelete(item)} />
        </div>
      </div>
      {item.info.isEditing && (
        <div className="user-video-item__editing">EDITING</div>
      )}
    </li>
  );
};

export default UserVideoItem;
