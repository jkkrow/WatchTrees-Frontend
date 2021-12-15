import UserLayout from 'components/User/Layout/UserLayout';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchHistory } from 'store/thunks/user-thunk';

const HistoryPage: React.FC = () => {
  const { refreshToken, accessToken } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (refreshToken) {
        accessToken && (await dispatch(fetchHistory({ page: 1, max: 20 })));
      }
    })();
  }, [dispatch, history, refreshToken, accessToken]);

  return <UserLayout></UserLayout>;
};

export default HistoryPage;
