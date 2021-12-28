import { useEffect } from 'react';
import { useParams } from 'react-router';

import UserLayout from 'components/User/Layout/UserLayout';
import Response from 'components/Common/UI/Response/Response';
import LoadingSpinner from 'components/Common/UI/Loader/LoadingSpinner';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { checkVerification } from 'store/thunks/user-thunk';

const VerificationPage: React.FC = () => {
  const { loading, error, message } = useAppSelector((state) => state.user);
  const { dispatch } = useAppDispatch();

  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    dispatch(checkVerification(token));
  }, [dispatch, token]);

  return (
    <UserLayout>
      <LoadingSpinner on={loading} />
      <Response type={error ? 'error' : 'message'} content={error || message} />
    </UserLayout>
  );
};

export default VerificationPage;
