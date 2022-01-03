import { ReactComponent as RectIcon } from 'assets/icons/rect.svg';
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  on?: boolean;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  on = true,
  overlay,
}) =>
  on ? (
    <div className={`loading-spinner${overlay ? ' overlay' : ''}`}>
      <RectIcon className="loading-spinner__1" />
      <RectIcon className="loading-spinner__2" />
      <RectIcon className="loading-spinner__3" />
    </div>
  ) : null;

export default LoadingSpinner;
