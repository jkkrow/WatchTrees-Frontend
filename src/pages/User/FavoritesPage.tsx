import UserLayout from 'components/User/Layout/UserLayout';
import VideoList from 'components/Video/List/VideoList';
import ChannelGroup from 'components/User/Channel/Group/ChannelGroup';
import { useAppSelector } from 'hooks/store-hook';
import { fetchSubscribes, fetchFavorites } from 'store/thunks/user-thunk';

const FavoritesPage: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.auth);

  return (
    <UserLayout>
      {accessToken && (
        <>
          <ChannelGroup
            label="Subscribes"
            forceUpdate={true}
            onFetch={fetchSubscribes}
          />
          <VideoList
            id="favorites"
            label="Favorite Videos"
            onFetch={fetchFavorites}
          />
        </>
      )}
    </UserLayout>
  );
};

export default FavoritesPage;
