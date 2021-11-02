import { useEffect, useState } from 'react';

import UserLayout from 'components/User/Layout/UserLayout';
import UserVideoHeader from 'components/User/UserVideos/Header/UserVideoHeader';
import UserVideoList from 'components/User/UserVideos/List/UserVideoList';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import Response from 'components/Common/UI/Response/Response';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { VideoTree } from 'store/reducers/video';
import { fetchUserVideos } from 'store/actions/user';
import { RouteComponentProps } from 'react-router';

const UserVideoListPage: React.FC<RouteComponentProps> = ({ location }) => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { loading, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [fetchedVideos, setFetchedVideos] = useState<VideoTree[]>([]);
  const [isFetched, setIsFetched] = useState(false);

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
      if (isFetched) return;

      const response = await dispatch(fetchUserVideos(currentPage));

      if (response) {
        setFetchedVideos(response.videos);
        setTotalPage(response.totalPage);
        setIsFetched(true);
      }
    })();
  }, [dispatch, accessToken, currentPage, isFetched]);

  return (
    <UserLayout>
      <UserVideoHeader currentPage={currentPage} />
      <LoadingSpinner on={loading} />
      <Response type="error" content={error} />
      {!loading && isFetched && (
        <>
          <UserVideoList items={fetchedVideos} />
          {fetchedVideos && (
            <Pagination
              baseUrl={location.pathname}
              totalPage={totalPage}
              currentPage={currentPage}
            />
          )}
        </>
      )}
    </UserLayout>
  );
};

export default UserVideoListPage;
