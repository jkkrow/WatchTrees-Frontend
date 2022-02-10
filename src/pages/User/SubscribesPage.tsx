import ChannelList from 'components/User/Channel/List/ChannelList';
import { fetchSubscribes } from 'store/thunks/user-thunk';
import 'styles/user.scss';

const SubscribersPage: React.FC = () => {
  return (
    <div className="user-page">
      <ChannelList label="Subscribes" onFetch={fetchSubscribes} />
    </div>
  );
};

export default SubscribersPage;
