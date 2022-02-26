import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import ChannelList from 'components/User/Channel/List/ChannelList';
import { fetchSubscribers } from 'store/thunks/user-thunk';
import 'styles/user.scss';

const SubscribersPage: React.FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Subscribers - WatchTrees</title>
      </Helmet>
      <div className="user-page">
        <ChannelList label="Subscribers" onFetch={fetchSubscribers} />
      </div>
    </Fragment>
  );
};

export default SubscribersPage;
