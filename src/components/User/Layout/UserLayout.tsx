import { useEffect } from 'react';

import { useAppDispatch } from 'hooks/store-hook';
import { clearResponse } from 'store/actions/user';
import './UserLayout.scss';

const UserLayout: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearResponse());
    };
  }, [dispatch]);

  return <div className="user-layout">{children}</div>;
};

export default UserLayout;
