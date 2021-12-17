import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import ChannelLoader from 'components/Common/UI/Loader/Channel/ChannelLoader';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as SubscribeIcon } from 'assets/icons/subscribe.svg';
import { ReactComponent as CheckIcon } from 'assets/icons/circle-check.svg';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { ChannelData } from 'store/slices/user-slice';
import { subscribeChannel } from 'store/thunks/user-thunk';
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
  const { userData } = useAppSelector((state) => state.auth);

  const [detail, setDetail] = useState<ChannelData | null>(data);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const dispatch = useAppDispatch();

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

    setSubscribeLoading(true);

    const { isSubscribed, subscribers } = await dispatch(
      subscribeChannel(detail._id)
    );

    setSubscribeLoading(false);
    setDetail((prev) => ({
      ...(prev as ChannelData),
      subscribers,
      isSubscribed,
    }));
  };

  return (
    <div className={`channel-info${column ? ' column' : ''}`}>
      <ChannelLoader on={loading} column={column} />
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
            <Button onClick={subscribeHandler} loading={subscribeLoading}>
              {detail.isSubscribed ? (
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

export default ChannelInfo;