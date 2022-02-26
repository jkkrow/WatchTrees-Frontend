import { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Response from 'components/Common/UI/Response/Response';
import Form from 'components/Common/Element/Form/Form';
import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { useForm } from 'hooks/form-hook';
import { useAppThunk } from 'hooks/store-hook';
import { checkRecovery, resetPassword } from 'store/thunks/auth-thunk';
import { VALIDATOR_PASSWORD, VALIDATOR_EQUAL } from 'util/validators';
import 'styles/auth.scss';

const ResetPasswordPage: React.FC = () => {
  const {
    dispatchThunk,
    loading,
    error,
    data: message,
  } = useAppThunk<string | null>(null);

  const [isAccessAllowed, setIsAccessAllowed] = useState(false);

  const { formState, setFormInput } = useForm({
    password: { value: '', isValid: false },
    confirmPassword: { value: '', isValid: false },
  });

  const { token } = useParams();

  const submitHandler = () => {
    if (!formState.isValid) return;

    dispatchThunk(
      resetPassword(
        formState.inputs.password.value,
        formState.inputs.confirmPassword.value,
        token!
      ),
      { errorMessage: false }
    );
  };

  useEffect(() => {
    (async () => {
      await dispatchThunk(checkRecovery(token!), { errorMessage: false });

      setIsAccessAllowed(true);
    })();
  }, [dispatchThunk, token]);

  return (
    <Fragment>
      <Helmet>
        <title>Reset Password - WatchTrees</title>
      </Helmet>
      <div className="auth-page">
        {!isAccessAllowed && (
          <>
            <LoadingSpinner on={loading} />
            <Response type="error" content={error} />
          </>
        )}
        {isAccessAllowed && (
          <>
            <Response
              type={error ? 'error' : 'message'}
              content={error || message}
            />
            {!message ? (
              <Form onSubmit={submitHandler}>
                <Input
                  id="password"
                  type="password"
                  formInput
                  autoFocus
                  autoComplete="new-password"
                  label="Password *"
                  message="At least 8 characters with lowercase, uppercase, number, and special character"
                  validators={[VALIDATOR_PASSWORD()]}
                  onForm={setFormInput}
                />
                <Input
                  id="confirmPassword"
                  type="password"
                  formInput
                  autoComplete="new-password"
                  label="Confirm Password *"
                  validators={[
                    VALIDATOR_EQUAL(formState.inputs.password.value),
                  ]}
                  onForm={setFormInput}
                />
                <Button loading={loading}>CHANGE PASSWORD</Button>
              </Form>
            ) : (
              <Link to="/auth">Sign in</Link>
            )}
          </>
        )}
      </div>
    </Fragment>
  );
};

export default ResetPasswordPage;
