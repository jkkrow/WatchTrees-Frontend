import { Outlet, Navigate } from 'react-router-dom';

import { useAppSelector } from 'hooks/common/store';

const AuthProvider: React.FC = () => {
  const userData = useAppSelector((state) => state.user.userData);

  return userData ? <Outlet /> : <Navigate to="/auth" />;
};

export default AuthProvider;
