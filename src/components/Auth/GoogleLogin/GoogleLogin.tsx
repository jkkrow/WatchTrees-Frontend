import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as GoogleIcon } from 'assets/icons/google.svg';
import { useGoogleAuth } from 'hooks/auth/google';
import './GoogleLogin.scss';

interface GoogleLoginProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  onVerify: (credential: string) => void;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({
  label,
  loading,
  disabled,
  invalid,
  onVerify,
}) => {
  const { googleButtonRef, isScriptLoaded } = useGoogleAuth((response) => {
    onVerify(response.credential!);
  });

  const buttonLoading = loading || !isScriptLoaded;

  return (
    <div
      className={`google-login-button${buttonLoading ? ' loading' : ''}${
        disabled ? ' disabled' : ''
      }${invalid ? ' invalid' : ''}`}
    >
      <Button
        type="button"
        loading={buttonLoading}
        disabled={disabled}
        invalid={invalid}
      >
        <div className="google-login-button__core" ref={googleButtonRef} />
        <div className="google-login-button__view">
          <GoogleIcon />
          {label}
        </div>
      </Button>
    </div>
  );
};

export default GoogleLogin;
