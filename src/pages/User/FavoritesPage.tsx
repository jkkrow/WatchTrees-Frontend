import { useCallback } from 'react';

import UserLayout from 'components/User/Layout/UserLayout';
import VideoList from 'components/Video/List/VideoList';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { fetchSubscribes, fetchFavorites } from 'store/thunks/user-thunk';
import ChannelList from 'components/User/Channel/Group/ChannelGroup';

const FavoritesPage: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const fetchSubscribesHandler = useCallback(async () => {
    return await dispatch(fetchSubscribes());
  }, [dispatch]);

  const fetchVideosHandler = useCallback(
    async (params: any, forceUpdate: boolean) => {
      return await dispatch(fetchFavorites(params, true));
    },
    [dispatch]
  );

  return (
    <UserLayout>
      {accessToken && (
        <>
          <ChannelList label="Subscribes" onFetch={fetchSubscribesHandler} />
          <VideoList label="Favorite Videos" onFetch={fetchVideosHandler} />
        </>
      )}
    </UserLayout>
  );
};

export default FavoritesPage;
