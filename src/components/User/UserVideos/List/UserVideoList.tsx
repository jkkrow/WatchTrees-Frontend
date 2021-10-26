import Table from 'components/Common/Element/Table/Table';
import { formatSize, formatTime, formatNumber } from 'util/format';
import './UserVideoList.scss';

interface UserVideoListProps {
  items: any[] /* VideoItem[] */;
  onEdit: (item: Object) => void;
  onDelete: (item: { title: string }) => void;
}

const UserVideoList: React.FC<UserVideoListProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  const listData = items.map((item) => ({
    ...item,
    views: formatNumber(item.views),
    size: formatSize(item.size),
    minDuration: formatTime(item.minDuration),
    maxDuration: formatTime(item.maxDuration),
  }));

  return (
    <div className="user-video-list">
      <Table
        data={listData}
        exclude={['_id', 'createdAt']}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default UserVideoList;
