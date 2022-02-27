import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import ChannelGrid from 'components/User/Channel/Grid/ChannelGrid';
import { fetchSubscribers } from 'store/thunks/user-thunk';

const SubscribersPage: React.FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Subscribers - WatchTrees</title>
      </Helmet>
      <ChannelGrid label="Subscribers" onFetch={fetchSubscribers} />
    </Fragment>
  );
};

export default SubscribersPage;
