import { useState } from 'react';
import { Link } from 'react-router-dom';

import AuthLayout from 'components/Auth/Layout/AuthLayout';
import Response from 'components/Common/UI/Response/Response';
import Form from 'components/Common/Element/Form/Form';
import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import GoogleLoginButton from 'components/Auth/Google/GoogleLoginButton';
import { useForm } from 'hooks/form-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { authActions } from 'store/slices/auth-slice';
import { register, login } from 'store/thunks/auth-thunk';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_PASSWORD,
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EQUAL,
} from 'util/validators';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const { loading, error, message } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { formState, setFormInput, setFormData } = useForm({
    email: { value: '', isValid: false },
    password: { value: '', isValid: false },
  });

  const googleLoginHandler = (response: { tokenId: string }): void => {
    dispatch(login({ tokenId: response.tokenId }));
  };

  const submitHandler = () => {
    if (!formState.isValid) return;

    if (isLogin) {
      dispatch(
        login({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        })
      );
    } else {
      dispatch(
        register({
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
          confirmPassword: formState.inputs.confirmPassword.value,
        })
      );
    }
  };

  const toggleMode = (): void => {
    dispatch(authActions.clearResponse());

    setIsLogin((prevMode) => {
      if (prevMode) {
        setFormData(
          {
            name: { value: '', isValid: false },
            email: { value: '', isValid: false },
            password: { value: '', isValid: false },
            confirmPassword: { value: '', isValid: false },
          },
          false
        );
      } else {
        setFormData(
          {
            email: { value: '', isValid: false },
            password: { value: '', isValid: false },
          },
          false
        );
      }
      return !prevMode;
    });
  };

  return (
    <AuthLayout>
      <Response type={error ? 'error' : 'message'} content={error || message} />
      {isLogin && (
        <Form onSubmit={submitHandler}>
          <Input
            id="email"
            formInput
            autoComplete="email"
            label="Email *"
            validators={[VALIDATOR_EMAIL()]}
            onForm={setFormInput}
          />
          <Input
            id="password"
            type="password"
            formInput
            autoComplete="current-password"
            label="Password *"
            validators={[VALIDATOR_REQUIRE()]}
            onForm={setFormInput}
          />
          <>
            <Link
              to="/auth/recovery"
              style={{ margin: '0 1rem 0 auto', fontSize: '1.2rem' }}
              tabIndex={-1}
            >
              Forgot Password
            </Link>
          </>
          <Button loading={loading}>SIGN IN</Button>
        </Form>
      )}
      {!isLogin && (
        <Form onSubmit={submitHandler}>
          <Input
            id="name"
            formInput
            autoComplete="name"
            label="Name *"
            message="At least 4 characters"
            validators={[VALIDATOR_MINLENGTH(4)]}
            onForm={setFormInput}
          />
          <Input
            id="email"
            formInput
            autoComplete="email"
            label="Email *"
            validators={[VALIDATOR_EMAIL()]}
            onForm={setFormInput}
          />
          <Input
            id="password"
            type="password"
            formInput
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
          <Button loading={loading}>SIGN UP</Button>
        </Form>
      )}
      <GoogleLoginButton
        onLoginSuccess={googleLoginHandler}
        loading={loading}
      />
      {isLogin ? (
        <p>
          Don't have an account?{' '}
          <span className="link" onClick={toggleMode}>
            Sign up
          </span>
        </p>
      ) : (
        <p>
          Already have an account?{' '}
          <span className="link" onClick={toggleMode}>
            Sign in
          </span>
        </p>
      )}
    </AuthLayout>
  );
};

export default AuthPage;
