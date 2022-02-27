import { GoogleLogin as GoogleLoginButton } from 'react-google-login';

import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as GoogleIcon } from 'assets/icons/google.svg';
import { useAppThunk } from 'hooks/store-hook';
import { signin } from 'store/thunks/auth-thunk';
import './GoogleLogin.scss';

interface GoogleLoginProps {
  onLogin: () => void;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onLogin }) => {
  const { dispatchThunk, loading } = useAppThunk();

  const googleLoginHandler = async (response: any) => {
    await dispatchThunk(signin({ tokenId: response.tokenId }), {
      response: { timer: 5000 },
    });

    onLogin();
  };

  return (
    <GoogleLoginButton
      className="google-login-button"
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
      prompt="select_account"
      cookiePolicy={'single_host_origin'}
      onSuccess={googleLoginHandler}
      render={(renderProps) => (
        <Button
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          loading={renderProps.disabled || loading}
        >
          <GoogleIcon />
          GOOGLE SIGN IN
        </Button>
      )}
    />
  );
};

export default GoogleLogin;
