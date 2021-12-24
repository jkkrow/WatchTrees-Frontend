import VideoList from 'components/Video/List/VideoList';
import ChannelGroup from 'components/User/Channel/Group/ChannelGroup';
import { useAppSelector } from 'hooks/store-hook';
import { fetchSubscribes, fetchFavorites } from 'store/thunks/user-thunk';

const FavoritesPage: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.auth);

  return (
    <div className="layout">
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
    </div>
  );
};

export default FavoritesPage;
