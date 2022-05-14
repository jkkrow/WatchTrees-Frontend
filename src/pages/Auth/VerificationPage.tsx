import { Fragment, useEffect } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet';

import AuthLayout from 'components/Auth/Layout/AuthLayout';
import Response from 'components/Common/UI/Response/Response';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { useAppThunk } from 'hooks/common/store';
import { checkVerification } from 'store/thunks/auth-thunk';

const VerificationPage: React.FC = () => {
  const { dispatchThunk, loading, error, message } = useAppThunk();

  const { token } = useParams();

  useEffect(() => {
    dispatchThunk(checkVerification(token!), { response: { message: false } });
  }, [dispatchThunk, token]);

  return (
    <Fragment>
      <Helmet>
        <title>Verification - WatchTrees</title>
      </Helmet>
      <AuthLayout>
        <LoadingSpinner on={loading} />
        <Response
          type={error ? 'error' : 'message'}
          content={error || message}
        />
      </AuthLayout>
    </Fragment>
  );
};

export default VerificationPage;
