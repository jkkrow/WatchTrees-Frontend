import MyVideoItem from '../Item/MyVideoItem';
import { VideoTreeClient } from 'store/slices/video-slice';
import './MyVideoList.scss';

interface MyVideoListProps {
  items: VideoTreeClient[];
  onDelete: (item: VideoTreeClient) => void;
}

const MyVideoList: React.FC<MyVideoListProps> = ({ items, onDelete }) => {
  return (
    <ul className="my-video-list">
      {items.map((item) => (
        <MyVideoItem key={item._id} item={item} onDelete={onDelete} />
      ))}
      {!items.length && (
        <div className="my-video-list__empty">No video found</div>
      )}
    </ul>
  );
};

export default MyVideoList;
