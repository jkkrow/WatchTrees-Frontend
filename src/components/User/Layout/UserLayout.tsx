import { useEffect } from 'react';

import { useAppDispatch } from 'hooks/store-hook';
import { userActions } from 'store/slices/user-slice';
import './UserLayout.scss';

const UserLayout: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(userActions.clearResponse());
    };
  }, [dispatch]);

  return <div className="user-layout">{children}</div>;
};

export default UserLayout;
