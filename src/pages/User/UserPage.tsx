import { useParams } from 'react-router';

import VideoList from 'components/Video/List/VideoList';

const UserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="layout">
      <VideoList params={{ userId: id }} />
    </div>
  );
};

export default UserPage;
