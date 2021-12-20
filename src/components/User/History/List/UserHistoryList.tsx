import UserHistoryItem from '../Item/UserHistoryItem';
import { VideoListDetail } from 'store/slices/video-slice';
import './UserHistoryList.scss';

interface UserHistoryListProps {
  items: VideoListDetail[];
}

const UserHistoryList: React.FC<UserHistoryListProps> = ({ items }) => {
  return (
    <div className="user-history-list">
      {items.map((item) => (
        <UserHistoryItem key={item._id} item={item} />
      ))}
      {!items.length && (
        <div className="user-history-list__empty">No video found</div>
      )}
    </div>
  );
};

export default UserHistoryList;
