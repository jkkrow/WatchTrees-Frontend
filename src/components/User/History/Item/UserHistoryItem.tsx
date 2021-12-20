import { VideoListDetail } from 'store/slices/video-slice';
import './UserHistoryItem.scss';

interface UserHistoryItemProps {
  item: VideoListDetail;
}

const UserHistoryItem: React.FC<UserHistoryItemProps> = ({ item }) => {
  return <div className="user-history-item"></div>;
};

export default UserHistoryItem;
