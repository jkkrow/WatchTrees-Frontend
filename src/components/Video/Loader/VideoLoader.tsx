import Card from 'components/Common/UI/Card/Card';
import './VideoLoader.scss';

interface VideoLoaderProps {
  on?: boolean;
  detail?: boolean;
}

const VideoLoader: React.FC<VideoLoaderProps> = ({ on = true, detail }) =>
  on ? (
    <Card className="video-loader">
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
    </Card>
  ) : null;

export default VideoLoader;
