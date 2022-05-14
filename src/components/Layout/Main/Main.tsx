import { Suspense } from 'react';

import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { useAppSelector } from 'hooks/common/store';
import './Main.scss';

const Main: React.FC = ({ children }) => {
  const { refreshToken, accessToken } = useAppSelector((state) => state.auth);

  return (
    <main className="main">
      <Suspense fallback={<LoadingSpinner overlay />}>
        {(!refreshToken || (refreshToken && accessToken)) && children}
      </Suspense>
    </main>
  );
};

export default Main;
