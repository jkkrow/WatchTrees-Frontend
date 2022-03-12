import { useEffect, useRef } from 'react';

export const useOutsideClickHander = <T extends HTMLElement>(
  onClose: (on: boolean) => void,
  isMounted?: boolean
) => {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    if (isMounted !== undefined && !isMounted) return;

    const outsideClickHandler = (event: MouseEvent) => {
      if (!targetRef || !targetRef.current) return;
      if (!targetRef.current.contains(event.target as Node)) {
        onClose(false);
      }
    };

    document.addEventListener('click', outsideClickHandler);

    return () => {
      document.removeEventListener('click', outsideClickHandler);
    };
  }, [onClose, isMounted]);

  return targetRef;
};
