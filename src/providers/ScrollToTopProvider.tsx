import { Fragment, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTopProvider: React.FC = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return <Fragment>{children}</Fragment>;
};

export default ScrollToTopProvider;
