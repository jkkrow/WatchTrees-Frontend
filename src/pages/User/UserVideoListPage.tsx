import { useEffect, useMemo, useState } from 'react';

import UserLayout from 'components/User/Layout/UserLayout';
import UserVideoHeader from 'components/User/Video/Header/UserVideoHeader';
import UserVideoList from 'components/User/Video/List/UserVideoList';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import Response from 'components/Common/UI/Response/Response';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { fetchUserVideos } from 'store/actions/user-action';
import { RouteComponentProps } from 'react-router';

const UserVideoListPage: React.FC<RouteComponentProps> = ({
  history,
  location,
}) => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { loading, error, userData } = useAppSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState(0);
  const [isFetched, setIsFetched] = useState(false);

  const dispatch = useAppDispatch();
  const { videos, count } = useMemo(
    () => ({
      videos: userData!.videos.data,
      count: userData!.videos.count,
    }),
    [userData]
  );

  useEffect(() => {
    let page = 1;

    if (location.search) {
      const urlQuery = new URLSearchParams(location.search);
      const pageQuery = urlQuery.get('page');

      if (!pageQuery) return;

      page = +pageQuery;
    }

    setCurrentPage(page);
  }, [location.search]);

  useEffect(() => {
    (async () => {
      if (!accessToken || !currentPage) return;

      const success = await dispatch(
        fetchUserVideos(currentPage, history.action !== 'POP')
      );

      success && setIsFetched(true);
    })();
  }, [dispatch, accessToken, currentPage, history]);

  return (
    <UserLayout>
      <UserVideoHeader currentPage={currentPage} />
      <LoadingSpinner on={loading} />
      <Response type="error" content={error} />
      {!loading && isFetched && (
        <>
          <UserVideoList items={videos} />
          {videos.length > 0 && (
            <Pagination
              baseUrl={location.pathname}
              count={count}
              currentPage={currentPage}
            />
          )}
        </>
      )}
    </UserLayout>
  );
};

export default UserVideoListPage;
