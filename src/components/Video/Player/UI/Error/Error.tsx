import { memo } from 'react';

import { ReactComponent as ReloadIcon } from 'assets/icons/reload.svg';
import './Error.scss';

interface ErrorProps {
  on: boolean;
}

const Error: React.FC<ErrorProps> = ({ on }) => {
  const refreshHandler = () => {
    window.location.reload();
  };

  return on ? (
    <div className="vp-error">
      <p>Error occurred! Please try again</p>
      <ReloadIcon className="btn" onClick={refreshHandler} />
    </div>
  ) : null;
};

export default memo(Error);
