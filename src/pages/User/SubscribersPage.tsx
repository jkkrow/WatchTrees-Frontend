import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import ChannelGrid from 'components/User/Channel/Grid/ChannelGrid';
import { usePaginate } from 'hooks/common/page';
import { useAppThunk } from 'hooks/common/store';
import { ChannelData } from 'store/slices/user-slice';
import { fetchSubscribers } from 'store/thunks/user-thunk';

const SubscribersPage: React.FC = () => {
  const { dispatchThunk, data, loading, loaded } = useAppThunk<{
    channels: ChannelData[];
    count: number;
  }>({ channels: [], count: 0 });

  const { currentPage, pageSize } = usePaginate();

  useEffect(() => {
    dispatchThunk(fetchSubscribers({ page: currentPage, max: pageSize }));
  }, [dispatchThunk, currentPage, pageSize]);

  return (
    <Fragment>
      <Helmet>
        <title>Subscribers - WatchTree</title>
      </Helmet>
      <ChannelGrid
        data={data}
        loading={loading}
        loaded={loaded}
        currentPage={currentPage}
        pageSize={pageSize}
        label="Subscribers"
      />
    </Fragment>
  );
};

export default SubscribersPage;
