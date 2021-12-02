import { useParams } from 'react-router';

import VideoList from 'components/Video/List/VideoList';

const ChannelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="layout">
      <VideoList params={{ userId: id }} />
    </div>
  );
};

export default ChannelPage;
