import { useEffect } from 'react';

import NewVideo from 'components/User/UserVideos/Header/NewVideo';
import UserVideoList from 'components/User/UserVideos/List/UserVideoList';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import {
  useAppDispatch,
  useAuthSelector,
  useUserSelector,
} from 'hooks/store-hook';
import { fetchVideos } from 'store/actions/user';

const UserVideoListPage: React.FC = () => {
  const { accessToken } = useAuthSelector();
  const { userData, loading } = useUserSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      // if (userData?.videos || !accessToken) return;

      const result = await dispatch(fetchVideos('accessToken'));
      console.log(result);
    })();
  }, [dispatch, userData, accessToken]);

  return (
    <div className="layout">
      <NewVideo />
      <LoadingSpinner on={loading} />
      {/* {userData?.videos?.length ? (
        <UserVideoList items={userData.videos} />
      ) : null} */}
    </div>
  );
};

export default UserVideoListPage;
