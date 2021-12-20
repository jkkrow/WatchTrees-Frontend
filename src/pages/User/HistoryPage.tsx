import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import UserLayout from 'components/User/Layout/UserLayout';
import UserHistoryList from 'components/User/History/List/UserHistoryList';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { VideoListDetail } from 'store/slices/video-slice';
import { fetchHistory } from 'store/thunks/user-thunk';

const HistoryPage: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const [videos, setVideos] = useState<VideoListDetail[]>([]);

  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (accessToken) {
        const data = await dispatch(fetchHistory({ page: 1, max: 20 }));

        setVideos(data.videos);
      }
    })();
  }, [dispatch, history, accessToken]);

  return (
    <UserLayout>
      <UserHistoryList items={videos} />
    </UserLayout>
  );
};

export default HistoryPage;
