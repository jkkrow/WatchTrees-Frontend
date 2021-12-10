import UserLayout from 'components/User/Layout/UserLayout';
import VideoList from 'components/Video/List/VideoList';
import Response from 'components/Common/UI/Response/Response';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { fetchFavorites } from 'store/thunks/user-thunk';

const FavoritesPage: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { error } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const fetchVideosHandler = async (params: any, forceUpdate: boolean) => {
    return await dispatch(fetchFavorites(params, forceUpdate));
  };

  return (
    <UserLayout>
      <Response type="error" content={error} />
      {accessToken && <VideoList onFetch={fetchVideosHandler} />}
    </UserLayout>
  );
};

export default FavoritesPage;
