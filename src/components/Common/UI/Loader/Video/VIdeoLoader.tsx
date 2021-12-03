import './VideoLoader.scss';

interface LoadingCardProps {
  on: boolean;
  detail?: boolean;
}

const VideoLoader: React.FC<LoadingCardProps> = ({ on, detail }) =>
  on ? (
    <div className="video-loader">
      <div className="video-loader__thumbnail" />
      {detail ? (
        <div className="video-loader__info">
          <div className="video-loader__avatar" />
          <div className="video-loader__detail">
            <div className="video-loader__title" />
            <div className="video-loader__description" />
          </div>
        </div>
      ) : null}
    </div>
  ) : null;

export default VideoLoader;
