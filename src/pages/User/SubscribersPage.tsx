import ChannelList from 'components/User/Channel/List/ChannelList';
import { fetchSubscribers } from 'store/thunks/user-thunk';
import 'styles/user.scss';

const SubscribersPage: React.FC = () => {
  return (
    <div className="user-page">
      <ChannelList label="Subscribers" onFetch={fetchSubscribers} />
    </div>
  );
};

export default SubscribersPage;
