import { memo } from 'react';

import { ReactComponent as ReloadIcon } from 'assets/icons/reload.svg';
import './Error.scss';

interface ErrorProps {
  error: MediaError | null;
}

const Error: React.FC<ErrorProps> = ({ error }) => {
  const refreshHandler = () => {
    window.location.reload();
  };

  return error ? (
    <div className="vp-error">
      {error.code && <p>Error Code: {error.code}</p>}
      <p>{error.message || 'Error occurred! Please try again'}</p>
      <ReloadIcon className="btn" onClick={refreshHandler} />
    </div>
  ) : null;
};

export default memo(Error);
