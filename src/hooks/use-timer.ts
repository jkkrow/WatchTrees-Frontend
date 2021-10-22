import { useCallback, useEffect, useRef } from 'react';

export const useTimeout = () => {
  const timeoutRef = useRef();

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  const set = useCallback(
    (callback, delay) => {
      clear();
      timeoutRef.current = setTimeout(callback, delay);
    },
    [clear]
  );

  useEffect(() => {
    return clear;
  }, [clear]);

  return [set, clear];
};

export const useInterval = () => {
  const intervalRef = useRef();

  const clear = useCallback(() => {
    intervalRef.current && clearInterval(intervalRef.current);
  }, []);

  const set = useCallback(
    (callback, delay) => {
      clear();
      intervalRef.current = setInterval(callback, delay);
    },
    [clear]
  );

  useEffect(() => {
    return clear;
  }, [clear]);

  return [set, clear];
};
