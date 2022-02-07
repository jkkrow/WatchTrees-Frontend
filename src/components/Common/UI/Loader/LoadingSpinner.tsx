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
      <div />
      <div />
      <div />
    </div>
  ) : null;

export default LoadingSpinner;
