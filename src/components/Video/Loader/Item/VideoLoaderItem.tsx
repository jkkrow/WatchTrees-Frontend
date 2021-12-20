import './VideoLoaderItem.scss';

interface VideoLoaderItemProps {
  on: boolean;
  detail?: boolean;
}

const VideoLoaderItem: React.FC<VideoLoaderItemProps> = ({ on, detail }) =>
  on ? (
    <div className="video-loader-item">
      <div className="video-loader-item__thumbnail" />
      {detail ? (
        <div className="video-loader-item__info">
          <div className="video-loader-item__avatar" />
          <div className="video-loader-item__detail">
            <div className="video-loader-item__title" />
            <div className="video-loader-item__description" />
          </div>
        </div>
      ) : null}
    </div>
  ) : null;

export default VideoLoaderItem;
