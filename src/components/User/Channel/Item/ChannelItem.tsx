import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

import Card from 'components/Common/UI/Card/Card';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import Button from 'components/Common/Element/Button/Button';
import ChannelLoader from '../Loader/ChannelLoader';
import { ReactComponent as VideoIcon } from 'assets/icons/preview.svg';
import { ReactComponent as SubscribeUsersIcon } from 'assets/icons/subscribe-users.svg';
import { ReactComponent as SubscribeAddIcon } from 'assets/icons/subscribe-add.svg';
import { ReactComponent as SubscribeAddedIcon } from 'assets/icons/subscribe-added.svg';
import { useAppSelector, useAppThunk } from 'hooks/store-hook';
import { ChannelData } from 'store/slices/user-slice';
import { toggleSubscribe } from 'store/thunks/user-thunk';
import { formatNumber } from 'util/format';
import './ChannelItem.scss';

interface ChannelItemProps {
  data: ChannelData | null;
  loading?: boolean;
  button?: boolean;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ data, loading, button }) => {
  const { userData } = useAppSelector((state) => state.user);
  const { dispatchThunk, loading: thunkLoading } = useAppThunk();

  const [detail, setDetail] = useState<ChannelData | null>(data);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setDetail(data);
  }, [data]);

  const navigateHandler = () => {
    detail && button && navigate(`/channel/${detail._id}`);
  };

  const subscribeHandler = async () => {
    if (!detail) {
      return;
    }

    if (!userData) {
      return navigate('/auth', { state: location.pathname });
    }

    await dispatchThunk(toggleSubscribe(detail._id), {
      response: { timer: 3000 },
    });

    setDetail((prev) => ({
      ...prev!,
      subscribers: prev!.isSubscribed
        ? prev!.subscribers - 1
        : prev!.subscribers + 1,
      isSubscribed: !prev!.isSubscribed,
    }));
  };

  return (
    <Card className="channel-item">
      <ChannelLoader on={!!loading} />
      {detail && !loading && (
        <div className="channel-item__container">
          <Avatar
            src={detail.picture}
            width="8rem"
            height="8rem"
            button={button}
            onClick={navigateHandler}
          />
          <div className="channel-item__detail">
            <h3
              className={`channel-item__name${button ? ' btn' : ''}`}
              onClick={navigateHandler}
            >
              {detail.name}
            </h3>
            <div className="channel-item__data">
              <div className="channel-item__videos">
                <VideoIcon />
                <span>Videos: </span>
                <span>{formatNumber(detail.videos)}</span>
              </div>
              <div className="channel-item__subscribers">
                <SubscribeUsersIcon />
                <span>Subscribers: </span>
                <span>{formatNumber(detail.subscribers)}</span>
              </div>
            </div>
          </div>
          <div className="channel-item__subscribe">
            <Button onClick={subscribeHandler} loading={thunkLoading} inversed>
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
    </Card>
  );
};

export default ChannelItem;
