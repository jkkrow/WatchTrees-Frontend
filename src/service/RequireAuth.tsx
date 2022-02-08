import { Outlet, Navigate } from 'react-router-dom';

import { useAppSelector } from 'hooks/store-hook';

const RequreAuth: React.FC = () => {
  const userData = useAppSelector((state) => state.user.userData);

  return userData ? <Outlet /> : <Navigate to="/auth" />;
};

export default RequreAuth;
