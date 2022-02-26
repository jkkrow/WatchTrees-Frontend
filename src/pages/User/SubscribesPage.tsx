import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import ChannelList from 'components/User/Channel/List/ChannelList';
import { fetchSubscribes } from 'store/thunks/user-thunk';
import 'styles/user.scss';

const SubscribersPage: React.FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Subscribes - WatchTrees</title>
      </Helmet>
      <div className="user-page">
        <ChannelList label="Subscribes" onFetch={fetchSubscribes} />
      </div>
    </Fragment>
  );
};

export default SubscribersPage;
