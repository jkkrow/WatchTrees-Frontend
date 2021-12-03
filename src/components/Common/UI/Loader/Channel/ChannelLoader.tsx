import './ChannelLoader.scss';

interface ChannelLoaderProps {
  on: boolean;
}

const ChannelLoader: React.FC<ChannelLoaderProps> = ({ on }) => {
  return on ? (
    <div className="channel-loader">
      <div className="channel-loader__avatar" />
      <div className="channel-loader__detail">
        <div className="channel-loader__title" />
        <div className="channel-loader__description" />
      </div>
    </div>
  ) : null;
};

export default ChannelLoader;
