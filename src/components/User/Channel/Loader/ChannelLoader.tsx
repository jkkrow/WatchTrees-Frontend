import './ChannelLoader.scss';

interface ChannelLoaderProps {
  on: boolean;
  column?: boolean;
}

const ChannelLoader: React.FC<ChannelLoaderProps> = ({ on, column }) => {
  return on ? (
    <div className={`channel-loader${column ? ' column' : ''}`}>
      <div className="channel-loader__avatar" />
      <div className="channel-loader__detail">
        <div />
        <div />
        <div />
      </div>
    </div>
  ) : null;
};

export default ChannelLoader;
