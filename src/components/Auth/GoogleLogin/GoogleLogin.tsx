import { useState, useEffect, useCallback, useRef } from 'react';

import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as GoogleIcon } from 'assets/icons/google.svg';
import { useInterval } from 'hooks/timer-hook';
import { useAppThunk } from 'hooks/store-hook';
import { signin } from 'store/thunks/auth-thunk';
import './GoogleLogin.scss';

interface GoogleLoginProps {
  onLogin: () => void;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onLogin }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [google, setGoogle] = useState<Google>();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const [setGoogleInterval, clearGoogleInterval] = useInterval();
  const { dispatchThunk, loading } = useAppThunk();

  const googleLoginHandler = useCallback(
    async (credential: string) => {
      await dispatchThunk(signin({ tokenId: credential }), {
        response: { timer: 5000 },
      });

      onLogin();
    },
    [dispatchThunk, onLogin]
  );

  useEffect(() => {
    if (isScriptLoaded) return;

    const initializeGoogle = () => {
      if (!google || isScriptLoaded) return;

      setIsScriptLoaded(true);
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
        callback: async (response) => {
          await googleLoginHandler(response.credential!);
        },
      });
      google.accounts.id.renderButton(googleButtonRef.current!, {
        type: 'standard',
        width: 1000,
      });
    };

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.id = 'google-client-script';
    script.async = true;
    script.onload = initializeGoogle;
    document.querySelector('body')?.appendChild(script);

    return () => {
      google?.accounts.id.cancel();
      document.getElementById('google-client-script')?.remove();
    };
  }, [isScriptLoaded, google, googleLoginHandler]);

  useEffect(() => {
    setGoogleInterval(() => {
      if (typeof window !== 'undefined' && window.google) {
        setGoogle(window.google);
        clearGoogleInterval();
      }
    }, 100);
  }, [setGoogleInterval, clearGoogleInterval]);

  return (
    <div className="google-login-button">
      <Button loading={loading}>
        <div className="google-login-button__core" ref={googleButtonRef} />
        <div
          className={`google-login-button__view${loading ? ' loading' : ''}`}
        >
          <GoogleIcon />
          GOOGLE SIGN IN
        </div>
      </Button>
    </div>
  );
};

export default GoogleLogin;
