import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import UserLayout from 'components/User/Layout/UserLayout';
import UserHistoryList from 'components/User/History/List/UserHistoryList';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { fetchHistory } from 'store/thunks/user-thunk';

const HistoryPage: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.auth);

  const { dispatchThunk, data } = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    accessToken && dispatchThunk(fetchHistory({ page: 1, max: 20 }));
  }, [dispatchThunk, history, accessToken]);

  return (
    <UserLayout>
      <UserHistoryList items={data} />
    </UserLayout>
  );
};

export default HistoryPage;
