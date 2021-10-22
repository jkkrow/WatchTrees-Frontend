import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AuthLayout from 'components/Auth/AuthLayout/AuthLayout';
import Response from 'components/Common/UI/Response/Response';
import Form from 'components/Common/Element/Form/Form';
import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { useForm } from 'hooks/use-form';
import { VALIDATOR_PASSWORD, VALIDATOR_EQUAL } from 'util/validators';
import { getResetPassword, postResetPassword } from 'store/actions/auth';

const ResetPasswordPage = () => {
  const [isAccessAllowed, setIsAccessAllowed] = useState(false);

  const { loading, error, message } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { formState, setFormInput } = useForm({
    password: { value: '', isValid: false },
    confirmPassword: { value: '', isValid: false },
  });

  const { token } = useParams();

  const submitHandler = () => {
    if (!formState.isValid) return;

    dispatch(
      postResetPassword(
        formState.inputs.password.value,
        formState.inputs.confirmPassword.value,
        token
      )
    );
  };

  useEffect(() => {
    dispatch(getResetPassword(token), () => setIsAccessAllowed(true));
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
                formElement
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
                formElement
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
