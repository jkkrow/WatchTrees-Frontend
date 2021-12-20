import './ChannelLoaderItem.scss';

interface ChannelLoaderItemProps {
  on: boolean;
  column?: boolean;
}

const ChannelLoaderItem: React.FC<ChannelLoaderItemProps> = ({
  on,
  column,
}) => {
  return on ? (
    <div className={`channel-loader-item${column ? ' column' : ''}`}>
      <div className="channel-loader-item__avatar" />
      <div className="channel-loader-item__detail">
        <div className="channel-loader-item__title" />
        <div className="channel-loader-item__description" />
        <div className="channel-loader-item__button" />
      </div>
    </div>
  ) : null;
};

export default ChannelLoaderItem;
