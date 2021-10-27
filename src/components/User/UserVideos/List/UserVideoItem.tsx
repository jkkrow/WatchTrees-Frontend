import { VideoTree } from 'store/reducers/video';
import { formatSize, formatTime, formatNumber } from 'util/format';
import './UserVideoList.scss';

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
  return <li className="user-video-item"></li>;
};

export default UserVideoItem;
