import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import AuthLayout from 'components/Auth/Layout/AuthLayout';
import Response from 'components/Common/UI/Response/Response';
import Form from 'components/Common/Element/Form/Form';
import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import LoadingSpinner from 'components/Common/UI/Loader/LoadingSpinner';
import { useForm } from 'hooks/form-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { checkRecovery, resetPassword } from 'store/thunks/auth-thunk';
import { VALIDATOR_PASSWORD, VALIDATOR_EQUAL } from 'util/validators';

const ResetPasswordPage: React.FC = () => {
  const [isAccessAllowed, setIsAccessAllowed] = useState(false);

  const { loading, error, message } = useAppSelector((state) => state.auth);
  const { dispatch } = useAppDispatch();

  const { formState, setFormInput } = useForm({
    password: { value: '', isValid: false },
    confirmPassword: { value: '', isValid: false },
  });

  const { token } = useParams<{ token: string }>();

  const submitHandler = () => {
    if (!formState.isValid) return;

    dispatch(
      resetPassword(
        formState.inputs.password.value,
        formState.inputs.confirmPassword.value,
        token
      )
    );
  };

  useEffect(() => {
    (async () => {
      await dispatch(checkRecovery(token));

      setIsAccessAllowed(true);
    })();
  }, [dispatch, token]);

  return (
    <AuthLayout>
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
                validators={[VALIDATOR_EQUAL(formState.inputs.password.value)]}
                onForm={setFormInput}
              />
              <Button loading={loading}>CHANGE PASSWORD</Button>
            </Form>
          ) : (
            <Link to="/auth">Sign in</Link>
          )}
        </>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
