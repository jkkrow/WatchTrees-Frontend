import { useEffect } from 'react';
import { useParams } from 'react-router';

import Response from 'components/Common/UI/Response/Response';
import LoadingSpinner from 'components/Common/UI/Loader/LoadingSpinner';
import { useAppThunk } from 'hooks/store-hook';
import { checkVerification } from 'store/thunks/auth-thunk';
import 'styles/auth.scss';

const VerificationPage: React.FC = () => {
  const {
    dispatchThunk,
    loading,
    error,
    data: message,
  } = useAppThunk<string | null>(null, { errorMessage: false });

  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    dispatchThunk(checkVerification(token));
  }, [dispatchThunk, token]);

  return (
    <div className="auth-page">
      <LoadingSpinner on={loading} />
      <Response type={error ? 'error' : 'message'} content={error || message} />
    </div>
  );
};

export default VerificationPage;
