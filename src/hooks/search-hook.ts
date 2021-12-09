import { useMemo } from 'react';
import { useLocation } from 'react-router';

export const useSearch = () => {
  const location = useLocation();

  const keyword = useMemo(() => {
    let text = '';

    if (location.search) {
      const urlQuery = new URLSearchParams(location.search);
      text = urlQuery.get('search') || '';
    }

    return text;
  }, [location.search]);

  return { keyword };
};
