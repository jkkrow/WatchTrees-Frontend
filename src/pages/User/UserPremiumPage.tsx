import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import UserPremiumDashboard from 'components/User/Premium/Dashboard/UserPremiumDashboard';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { useAppSelector, useAppThunk } from 'hooks/common/store';
import { fetchUserPremium } from 'store/thunks/user-thunk';
import { UserPremium } from 'store/slices/user-slice';

const UserPremiumPage: React.FC = () => {
  const userData = useAppSelector((state) => state.user.userData!);
  const { dispatchThunk, loaded } = useAppThunk<{
    premium: UserPremium;
  }>();

  useEffect(() => {
    dispatchThunk(fetchUserPremium());
  }, [dispatchThunk]);

  return (
    <Fragment>
      <Helmet>
        <title>Premium Membership - WatchTree</title>
      </Helmet>

      <LoadingSpinner on={!loaded} />
      {userData.premium && loaded && (
        <UserPremiumDashboard premium={userData.premium} />
      )}
    </Fragment>
  );
};

export default UserPremiumPage;
