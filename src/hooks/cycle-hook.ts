import { useEffect, useRef } from 'react';

const usePrevious = (value: any): typeof value => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export const useCompare = (value: any): boolean => {
  const prevValue = usePrevious(value);

  return prevValue !== value;
};

export const useFirstRender = () => {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
};
