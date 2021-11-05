import { useEffect } from 'react';

import { useAppDispatch } from 'hooks/store-hook';
import { clearResponse } from 'store/actions/auth-action';
import './AuthLayout.scss';

const AuthLayout: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearResponse());
    };
  }, [dispatch]);

  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
