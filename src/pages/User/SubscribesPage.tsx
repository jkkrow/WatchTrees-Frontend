import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import ChannelGrid from 'components/User/Channel/Grid/ChannelGrid';
import { usePaginate } from 'hooks/page-hook';
import { useAppThunk } from 'hooks/store-hook';
import { ChannelData } from 'store/slices/user-slice';
import { fetchSubscribes } from 'store/thunks/user-thunk';

const SubscribersPage: React.FC = () => {
  const { dispatchThunk, data, loading, loaded } = useAppThunk<{
    channels: ChannelData[];
    count: number;
  }>({ channels: [], count: 0 });

  const { currentPage, pageSize } = usePaginate();

  useEffect(() => {
    dispatchThunk(fetchSubscribes({ page: currentPage, max: pageSize }));
  }, [dispatchThunk, currentPage, pageSize]);

  return (
    <Fragment>
      <Helmet>
        <title>Subscribes - WatchTrees</title>
      </Helmet>
      <ChannelGrid
        data={data}
        loading={loading}
        loaded={loaded}
        currentPage={currentPage}
        pageSize={pageSize}
        label="Subscribes"
      />
    </Fragment>
  );
};

export default SubscribersPage;
