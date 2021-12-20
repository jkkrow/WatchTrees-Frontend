import { useEffect } from 'react';
import { useParams } from 'react-router';

import AuthLayout from 'components/Auth/Layout/AuthLayout';
import Response from 'components/Common/UI/Response/Response';
import LoadingSpinner from 'components/Common/UI/Loader/LoadingSpinner';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { checkVerification } from 'store/thunks/auth-thunk';

const VerificationPage: React.FC = () => {
  const { loading, error, message } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    dispatch(checkVerification(token));
  }, [dispatch, token]);

  return (
    <AuthLayout>
      <LoadingSpinner on={loading} />
      <Response type={error ? 'error' : 'message'} content={error || message} />
    </AuthLayout>
  );
};

export default VerificationPage;
