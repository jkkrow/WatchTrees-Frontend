import { GoogleLogin } from 'react-google-login';

import { ReactComponent as GoogleIcon } from 'assets/icons/google.svg';
import Button from 'components/Common/Element/Button/Button';
import './GoogleLoginButton.scss';

interface GoogleLoginButtonProps {
  onLoginSuccess: (response: any) => void;
  loading: boolean;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onLoginSuccess,
  loading,
}) => {
  return (
    <GoogleLogin
      className="google-login-button"
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
      prompt="select_account"
      cookiePolicy={'single_host_origin'}
      onSuccess={onLoginSuccess}
      render={(renderProps) => (
        <Button
          onClick={renderProps.onClick}
          disabled={renderProps.disabled || loading}
          loading={renderProps.disabled}
        >
          <GoogleIcon />
          GOOGLE SIGN IN
        </Button>
      )}
    />
  );
};

export default GoogleLoginButton;
