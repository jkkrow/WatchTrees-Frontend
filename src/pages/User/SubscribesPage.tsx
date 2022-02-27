import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import ChannelGrid from 'components/User/Channel/Grid/ChannelGrid';
import { fetchSubscribes } from 'store/thunks/user-thunk';

const SubscribersPage: React.FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Subscribes - WatchTrees</title>
      </Helmet>
      <ChannelGrid label="Subscribes" onFetch={fetchSubscribes} />
    </Fragment>
  );
};

export default SubscribersPage;
