import { useEffect } from 'react';
import { useParams } from 'react-router';

import AuthLayout from 'components/Auth/Layout/AuthLayout';
import Response from 'components/Common/UI/Response/Response';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { verifyEmail } from 'store/thunks/auth-thunk';
import { updateUserData } from 'store/thunks/user-thunk';

const VerifyEmailPage: React.FC = () => {
  const { loading, error, message } = useAppSelector((state) => state.auth);
  const { userData } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    (async () => {
      const success = await dispatch(verifyEmail(token));

      if (!success || !userData) return;

      dispatch(updateUserData({ isVerified: true }));
    })();
  }, [dispatch, userData, token]);

  return (
    <AuthLayout>
      <LoadingSpinner on={loading} />
      <Response type={error ? 'error' : 'message'} content={error || message} />
    </AuthLayout>
  );
};

export default VerifyEmailPage;
