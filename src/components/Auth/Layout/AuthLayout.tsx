import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { clearResponse } from 'store/actions/auth';
import './AuthLayout.scss';

const AuthLayout: React.FC = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearResponse());
    };
  }, [dispatch]);

  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
