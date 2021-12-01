import VideoThumbnail from 'components/Video/Thumbnail/VideoThumbnail';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { VideoTree } from 'store/slices/video-slice';
import { formatNumber } from 'util/format';
import { videoDuration } from 'util/video';
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
        <div className="user-video-item__info__title">
          {item.info.title || '_'}
        </div>
        <div className="user-video-item__info__tags">
          {item.info.tags.map((tag) => `#${tag}`).join(', ')}
        </div>
        <div className="user-video-item__info__duration">
          {videoDuration(item)}
        </div>
        <div className="user-video-item__info__views">
          Views: {formatNumber(item.data.views)}
        </div>
        <div className="user-video-item__info__status">
          Status: {item.info.status}
        </div>
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
