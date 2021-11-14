import { useEffect } from 'react';

import { useAppDispatch } from 'hooks/store-hook';
import { authActions } from 'store/reducers/auth-reducer';
import './AuthLayout.scss';

const AuthLayout: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(authActions.clearResponse());
    };
  }, [dispatch]);

  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
