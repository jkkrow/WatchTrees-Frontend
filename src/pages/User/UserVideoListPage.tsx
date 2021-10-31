import { useEffect, useRef } from 'react';

import UserLayout from 'components/User/Layout/UserLayout';
import UserVideoHeader from 'components/User/UserVideos/Header/UserVideoHeader';
import UserVideoList from 'components/User/UserVideos/List/UserVideoList';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import Response from 'components/Common/UI/Response/Response';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { fetchUserVideos } from 'store/actions/user';

const UserVideoListPage: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { userData, loading, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const isFetched = useRef(false);

  useEffect(() => {
    (async () => {
      if (!userData || !accessToken) return;
      if (userData.videos.length) return;
      if (isFetched.current) return;

      const success = await dispatch(fetchUserVideos());

      if (success) {
        isFetched.current = true;
      }
    })();
  }, [dispatch, userData, accessToken, isFetched]);

  return (
    <UserLayout>
      <UserVideoHeader />
      <LoadingSpinner on={loading} />
      <Response type="error" content={error} />
      {userData && !loading && (
        <UserVideoList items={userData.videos} fetched={isFetched.current} />
      )}
    </UserLayout>
  );
};

export default UserVideoListPage;
