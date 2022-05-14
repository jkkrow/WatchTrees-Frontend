import { useState, useEffect, useRef } from 'react';

import { useInterval } from 'hooks/common/timer';

export const useGoogleAuth = (
  callback: (response: CredentialResponse) => void
) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [google, setGoogle] = useState<Google>();

  const googleButtonRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef<typeof callback>(callback);

  const [setGoogleInterval, clearGoogleInterval] = useInterval();

  useEffect(() => {
    if (isScriptLoaded) return;

    const initializeGoogle = () => {
      if (!google || isScriptLoaded) return;

      setIsScriptLoaded(true);
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
        callback: callbackRef.current!,
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
  }, [isScriptLoaded, google]);

  useEffect(() => {
    setGoogleInterval(() => {
      if (typeof window !== 'undefined' && window.google) {
        setGoogle(window.google);
        clearGoogleInterval();
      }
    }, 100);
  }, [setGoogleInterval, clearGoogleInterval]);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return { googleButtonRef, isScriptLoaded };
};
