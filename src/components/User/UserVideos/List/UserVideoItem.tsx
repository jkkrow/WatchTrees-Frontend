import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { VideoTree } from 'store/reducers/video';
import { formatSize, formatTime, formatNumber } from 'util/format';
import './UserVideoItem.scss';

interface UserVideoItemProps {
  item: VideoTree;
  onEdit: () => void;
  onDelete: (item: VideoTree) => void;
}

const UserVideoItem: React.FC<UserVideoItemProps> = ({ item, onEdit, onDelete }) => {
  return (
    <li className="user-video-item">
      <div className="user-video-item__thumbnail">
        {item.thumbnail ? <img src={item.thumbnail} alt={item.title} /> : 'No Thumbnail'}
      </div>
      <div className="user-video-item__info">
        <div>{item.title}</div>
        <div>{item.tags.join(', ')}</div>
        <div>{`${formatTime(item.minDuration)} - ${formatTime(item.maxDuration)}`}</div>
        <div>{formatSize(item.size)}</div>
        <div className="user-video-item__buttons">
          <EditIcon onClick={onEdit} />
          <DeleteIcon onClick={() => onDelete(item)} />
        </div>
      </div>
    </li>
  );
};

export default UserVideoItem;
