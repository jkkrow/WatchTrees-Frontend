import { useEffect, useState } from 'react';

import NewVideo from 'components/User/UserVideos/Header/UserVideoHeader';
import UserVideoList from 'components/User/UserVideos/List/UserVideoList';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { fetchVideos } from 'store/actions/user';

const UserVideoListPage: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { userData, loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    (async () => {
      if (!userData) return;
      if (userData.videos.length) return;
      if (isFetched) return;

      const success = await dispatch(fetchVideos());

      success && setIsFetched(true);
    })();
  }, [dispatch, userData, accessToken, isFetched]);

  return (
    <div className="layout">
      <NewVideo />
      <LoadingSpinner on={loading} />
      {userData && !loading && <UserVideoList items={userData.videos} />}
      {isFetched && userData && !userData.videos.length && <div>No Video</div>}
    </div>
  );
};

export default UserVideoListPage;
