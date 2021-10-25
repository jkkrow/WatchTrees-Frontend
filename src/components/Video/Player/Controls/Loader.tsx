import { memo } from 'react';

interface LoaderProps {
  on: boolean;
}

const Loader: React.FC<LoaderProps> = ({ on }) =>
  on ? (
    <div className="vp-loader">
      <div />
    </div>
  ) : null;

export default memo(Loader);
