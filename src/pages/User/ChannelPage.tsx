import { useParams } from 'react-router';

import UserLayout from 'components/User/Layout/UserLayout';
import ChannelHeader from 'components/User/Channel/ChannelHeader';
import VideoList from 'components/Video/List/VideoList';

const ChannelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <UserLayout>
      <ChannelHeader userId={id} />
      <VideoList params={{ userId: id }} />
    </UserLayout>
  );
};

export default ChannelPage;
