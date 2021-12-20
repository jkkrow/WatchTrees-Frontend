import { useCallback, useEffect, useState } from 'react';

import UserLayout from 'components/User/Layout/UserLayout';
import VideoList from 'components/Video/List/VideoList';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { ChannelData } from 'store/slices/user-slice';
import { fetchSubscribes, fetchFavorites } from 'store/thunks/user-thunk';
import ChannelList from 'components/User/Channel/List/ChannelList';

const FavoritesPage: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const [subscribes, setSubscribes] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      if (!accessToken) return;

      setLoading(true);

      const { subscribes } = await dispatch(fetchSubscribes());

      setSubscribes(subscribes);
      setLoading(false);
    })();
  }, [dispatch, accessToken]);

  const fetchVideosHandler = useCallback(
    async (params: any, forceUpdate: boolean) => {
      return await dispatch(fetchFavorites(params, true));
    },
    [dispatch]
  );

  return (
    <UserLayout>
      {(!loading && subscribes.length) > 0 && <h3>Subscribes</h3>}
      <ChannelList list={subscribes} loading={loading} />
      {accessToken && (
        <VideoList label="Favorite Videos" onFetch={fetchVideosHandler} />
      )}
    </UserLayout>
  );
};

export default FavoritesPage;
