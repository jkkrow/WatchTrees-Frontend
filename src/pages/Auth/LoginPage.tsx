import { Fragment, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AuthLayout from 'components/Auth/Layout/AuthLayout';
import Form from 'components/Common/Element/Form/Form';
import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import GoogleLogin from 'components/Auth/GoogleLogin/GoogleLogin';
import { useForm } from 'hooks/common/form';
import { useAppThunk } from 'hooks/common/store';
import { signup, signin } from 'store/thunks/auth-thunk';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_PASSWORD,
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EQUAL,
} from 'util/validators';

const LoginPage: React.FC = () => {
  const { dispatchThunk: authThunk, loading: authLoading } = useAppThunk();
  const { dispatchThunk: googleAuthThunk, loading: googleAuthLoading } =
    useAppThunk();

  const { formState, setFormInput, setFormData } = useForm({
    email: { value: '', isValid: false },
    password: { value: '', isValid: false },
  });

  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const navigateHandler = () => {
    navigate((location.state as 'string' | undefined) || '/', {
      replace: true,
    });
  };

  const submitHandler = async () => {
    if (!formState.isValid) return;

    if (isLogin) {
      await authThunk(
        signin({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
        { response: { timer: 5000 } }
      );
    } else {
      await authThunk(
        signup({
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
          confirmPassword: formState.inputs.confirmPassword.value,
        })
      );
    }

    navigateHandler();
  };

  const googleLoginHandler = async (credential: string) => {
    await googleAuthThunk(signin({ tokenId: credential }), {
      response: { timer: 5000 },
    });

    navigateHandler();
  };

  const toggleMode = (): void => {
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
    <Fragment>
      <Helmet>
        <title>{isLogin ? 'Signin' : 'Signup'} - WatchTrees</title>
      </Helmet>
      <AuthLayout>
        {isLogin && (
          <Form onSubmit={submitHandler}>
            <Input
              id="email"
              label="Email *"
              formInput
              autoComplete="email"
              validators={[VALIDATOR_EMAIL()]}
              onForm={setFormInput}
            />
            <Input
              id="password"
              type="password"
              label="Password *"
              formInput
              autoComplete="current-password"
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
            <Button loading={authLoading}>SIGN IN</Button>
          </Form>
        )}
        {!isLogin && (
          <Form onSubmit={submitHandler}>
            <Input
              id="name"
              label="Name *"
              formInput
              autoFocus
              autoComplete="name"
              message="At least 4 characters"
              validators={[VALIDATOR_MINLENGTH(4)]}
              onForm={setFormInput}
            />
            <Input
              id="email"
              label="Email *"
              formInput
              autoComplete="email"
              validators={[VALIDATOR_EMAIL()]}
              onForm={setFormInput}
            />
            <Input
              id="password"
              type="password"
              label="Password *"
              formInput
              autoComplete="new-password"
              message="At least 8 characters with lowercase, uppercase, number, and special character"
              validators={[VALIDATOR_PASSWORD()]}
              onForm={setFormInput}
            />
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password *"
              formInput
              autoComplete="new-password"
              validators={[VALIDATOR_EQUAL(formState.inputs.password.value)]}
              onForm={setFormInput}
            />
            <Button loading={authLoading}>SIGN UP</Button>
          </Form>
        )}
        <GoogleLogin
          label="GOOGLE SIGN IN"
          loading={googleAuthLoading}
          onVerify={googleLoginHandler}
        />
        {isLogin ? (
          <p>
            Don't have an account?{' '}
            <span className="btn" onClick={toggleMode}>
              Sign up
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <span className="btn" onClick={toggleMode}>
              Sign in
            </span>
          </p>
        )}
      </AuthLayout>
    </Fragment>
  );
};

export default LoginPage;
