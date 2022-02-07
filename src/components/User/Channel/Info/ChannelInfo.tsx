import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import Avatar from 'components/Common/UI/Avatar/Avatar';
import Button from 'components/Common/Element/Button/Button';
import ChannelLoaderItem from 'components/User/Channel/Loader/Item/ChannelLoaderItem';
import { ReactComponent as SubscribeAddIcon } from 'assets/icons/subscribe-add.svg';
import { ReactComponent as SubscribeAddedIcon } from 'assets/icons/subscribe-added.svg';
import { useAppSelector, useAppThunk } from 'hooks/store-hook';
import { ChannelData } from 'store/slices/user-slice';
import { toggleSubscribe } from 'store/thunks/user-thunk';
import { formatNumber } from 'util/format';
import './ChannelInfo.scss';

interface ChannelInfoProps {
  data: ChannelData | null;
  loading: boolean;
  column?: boolean;
  button?: boolean;
}

const ChannelInfo: React.FC<ChannelInfoProps> = ({
  data,
  loading,
  column,
  button,
}) => {
  const { userData } = useAppSelector((state) => state.user);
  const { dispatchThunk, loading: thunkLoading } = useAppThunk();

  const [detail, setDetail] = useState<ChannelData | null>(data);

  const history = useHistory();

  useEffect(() => {
    setDetail(data);
  }, [data]);

  const navigateHandler = () => {
    detail && button && history.push(`/channel/${detail._id}`);
  };

  const subscribeHandler = async () => {
    if (!detail) {
      return;
    }

    if (!userData) {
      return history.push('/auth');
    }

    await dispatchThunk(toggleSubscribe(detail._id));
    setDetail((prev) => ({
      ...prev!,
      subscribers: prev!.isSubscribed
        ? prev!.subscribers - 1
        : prev!.subscribers + 1,
      isSubscribed: !prev!.isSubscribed,
    }));
  };

  return (
    <div className={`channel-info${column ? ' column' : ''}`}>
      <ChannelLoaderItem on={loading} column={column} />
      {detail && !loading && (
        <div className="channel-info__container">
          <Avatar
            src={detail.picture}
            width="8rem"
            height="8rem"
            button={button}
            onClick={navigateHandler}
          />
          <div className="channel-info__detail">
            <h3
              className={`channel-info__title${button ? ' link' : ''}`}
              onClick={navigateHandler}
            >
              {detail.name}
            </h3>
            <div className="channel-info__subscribers">
              <span>Subscribers: </span>
              <span>{formatNumber(detail.subscribers)}</span>
            </div>
          </div>
          <div className="channel-info__subscribe">
            <Button onClick={subscribeHandler} loading={thunkLoading}>
              {detail.isSubscribed ? (
                <>
                  <SubscribeAddedIcon />
                  <span>Subscribed</span>
                </>
              ) : (
                <>
                  <SubscribeAddIcon />
                  <span>Subscribe</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelInfo;
