import './LoadingCard.scss';

interface LoadingCardProps {
  on: boolean;
  detail?: boolean;
}

const LoadingCard: React.FC<LoadingCardProps> = ({ on, detail }) =>
  on ? (
    <div className="loading-card">
      <div className="loading-card__thumbnail" />
      {detail ? (
        <div className="loading-card__info">
          <div className="loading-card__info__avatar" />
          <div className="loading-card__info__detail">
            <div className="loading-card__info__detail__title" />
            <div className="loading-card__info__detail__description" />
          </div>
        </div>
      ) : null}
    </div>
  ) : null;

export default LoadingCard;
