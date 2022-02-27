import { useMemo } from 'react';
import { useLocation } from 'react-router';

export const usePaginate = (pageSize = 12) => {
  const location = useLocation();

  const currentPage = useMemo(() => {
    let page = 1;

    if (location.search) {
      const urlQuery = new URLSearchParams(location.search);
      const pageQuery = urlQuery.get('page');

      if (!pageQuery) return page;

      page = +pageQuery;
    }

    return page;
  }, [location.search]);

  return { currentPage, pageSize };
};
