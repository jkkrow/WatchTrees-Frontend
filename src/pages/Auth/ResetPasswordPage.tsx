import { Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import AuthLayout from 'components/Auth/Layout/AuthLayout';
import Form from 'components/Common/Element/Form/Form';
import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import Response from 'components/Common/UI/Response/Response';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { useForm } from 'hooks/form-hook';
import { useAppThunk } from 'hooks/store-hook';
import { checkRecovery, resetPassword } from 'store/thunks/auth-thunk';
import { VALIDATOR_PASSWORD, VALIDATOR_EQUAL } from 'util/validators';

const ResetPasswordPage: React.FC = () => {
  const { dispatchThunk, loading, error, message } = useAppThunk();
  const { dispatchThunk: formThunk, loading: formLoading } = useAppThunk();

  const { formState, setFormInput } = useForm({
    password: { value: '', isValid: false },
    confirmPassword: { value: '', isValid: false },
  });

  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dispatchThunk(checkRecovery(token!), { response: { message: false } });
  }, [dispatchThunk, token]);

  const submitHandler = async () => {
    if (!formState.isValid) return;

    await formThunk(
      resetPassword(
        formState.inputs.password.value,
        formState.inputs.confirmPassword.value,
        token!
      ),
      { response: { timer: 5000 } }
    );

    navigate('/auth');
  };

  return (
    <Fragment>
      <Helmet>
        <title>Reset Password - WatchTrees</title>
      </Helmet>
      <AuthLayout>
        {!message && (
          <>
            <LoadingSpinner on={loading} />
            <Response type="error" content={error} />
          </>
        )}
        {message && !error && (
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
              validators={[VALIDATOR_EQUAL(formState.inputs.password.value)]}
              onForm={setFormInput}
            />
            <Button loading={formLoading}>CHANGE PASSWORD</Button>
          </Form>
        )}
      </AuthLayout>
    </Fragment>
  );
};

export default ResetPasswordPage;
