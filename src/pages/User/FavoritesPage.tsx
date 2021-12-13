import { useEffect, useState } from 'react';

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

  const fetchVideosHandler = async (params: any, forceUpdate: boolean) => {
    return await dispatch(fetchFavorites(params, forceUpdate));
  };

  return (
    <UserLayout>
      {(loading || (!loading && subscribes.length)) > 0 && <h2>Subscribes</h2>}
      <ChannelList list={subscribes} loading={loading} />
      <h2>Favorite Videos</h2>
      {accessToken && <VideoList onFetch={fetchVideosHandler} />}
    </UserLayout>
  );
};

export default FavoritesPage;
