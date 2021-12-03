import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import ChannelLoader from 'components/Common/UI/Loader/Channel/ChannelLoader';
import Response from 'components/Common/UI/Response/Response';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as SubscribeIcon } from 'assets/icons/subscribe.svg';
import { ReactComponent as CheckIcon } from 'assets/icons/circle-check.svg';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { fetchChannel, subscribeChannel } from 'store/thunks/user-thunk';
import { formatNumber } from 'util/format';
import './ChannelHeader.scss';

interface ChannelHeaderProps {
  userId: string;
}

interface ChannelInfo {
  _id: string;
  name: string;
  picture: string;
  subscribers: number;
  subsscribes: number;
  isSubscribed: boolean;
}

const ChannelHeader: React.FC<ChannelHeaderProps> = ({ userId }) => {
  const { loading, error } = useAppSelector((state) => state.user);
  const { userData } = useAppSelector((state) => state.auth);

  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const dispatch = useAppDispatch();

  const history = useHistory();

  const subscribeHandler = async () => {
    if (!userData) {
      return history.push('/auth');
    }

    setSubscribeLoading(true);

    const { isSubscribed, subscribers } = await dispatch(
      subscribeChannel(userId)
    );

    setSubscribeLoading(false);
    setChannelInfo((prevInfo) => ({
      ...(prevInfo as ChannelInfo),
      subscribers,
      isSubscribed,
    }));
  };

  useEffect(() => {
    (async () => {
      const channelInfo = await dispatch(fetchChannel(userId));

      setChannelInfo(channelInfo);
    })();
  }, [dispatch, userId]);

  return (
    <div className="channel-header">
      <Response type="error" content={error} />
      <ChannelLoader on={loading} />
      {channelInfo && !loading && (
        <div className="channel-header__container">
          <Avatar src={channelInfo.picture} width="8rem" height="8rem" />
          <div className="channel-header__detail">
            <h2 className="channel-header__title">{channelInfo.name}</h2>
            <div className="channel-header__subscribers">
              <span>Subscribers: </span>
              <span>{formatNumber(channelInfo.subscribers)}</span>
            </div>
          </div>
          <div className="channel-header__subscribe">
            <Button onClick={subscribeHandler} loading={subscribeLoading}>
              {channelInfo.isSubscribed ? (
                <>
                  <CheckIcon stroke="black" />
                  <span>Subscribed</span>
                </>
              ) : (
                <>
                  <SubscribeIcon fill="black" />
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

export default ChannelHeader;
