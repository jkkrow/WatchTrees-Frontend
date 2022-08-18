import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import AccountDashboard from 'components/User/Account/Dashboard/AccountDashboard';

const AccountPage: React.FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Account - WatchTree</title>
      </Helmet>
      <AccountDashboard />
    </Fragment>
  );
};

export default AccountPage;
