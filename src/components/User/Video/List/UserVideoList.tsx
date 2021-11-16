import UserVideoItem from '../Item/UserVideoItem';
import { VideoTree } from 'store/slices/video-slice';
import './UserVideoList.scss';

interface UserVideoListProps {
  items: VideoTree[];
  onEdit: () => void;
  onDelete: (item: VideoTree) => void;
}

const UserVideoList: React.FC<UserVideoListProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  return (
    <ul className="user-video-list">
      {items.map((item) => (
        <UserVideoItem
          key={item._id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      {!items.length && <div className="user-video-list__empty">No Video</div>}
    </ul>
  );
};

export default UserVideoList;
