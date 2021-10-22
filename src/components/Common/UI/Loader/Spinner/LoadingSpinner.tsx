import { ReactComponent as RectIcon } from "assets/icons/rect.svg";
import "./LoadingSpinner.scss";

const LoadingSpinner = ({ on, overlay }) =>
  on ? (
    <div className={`loading-spinner${overlay ? " overlay" : ""}`}>
      <RectIcon className="loading-spinner__1" />
      <RectIcon className="loading-spinner__2" />
      <RectIcon className="loading-spinner__3" />
    </div>
  ) : null;

export default LoadingSpinner;
