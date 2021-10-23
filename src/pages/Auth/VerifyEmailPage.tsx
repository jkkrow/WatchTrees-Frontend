import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import AuthLayout from 'components/Auth/AuthLayout/AuthLayout';
import Response from 'components/Common/UI/Response/Response';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { RootState } from 'store';
import { verifyEmail, updateUserData } from 'store/actions/auth';

const VerifyEmailPage: React.FC = () => {
  const { userData, loading, error, message } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch();

  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    dispatch(
      verifyEmail(token, () => {
        if (!userData) return;

        dispatch(updateUserData({ isVerified: true }));
      })
    );
  }, [dispatch, userData, token]);

  return (
    <AuthLayout>
      <LoadingSpinner on={loading} />
      <Response type={error ? 'error' : 'message'} content={error || message} />
    </AuthLayout>
  );
};

export default VerifyEmailPage;
