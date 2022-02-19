import { useEffect, useState } from 'react';

import { useTheme } from 'hooks/theme-hook';

export type Theme = 'light' | 'dark';

interface ThemeProps {
  mode?: Theme;
}

const ThemeProvider: React.FC<ThemeProps> = ({ mode, children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme, toggleClass } = useTheme();

  useEffect(() => {
    mode ? toggleClass(mode) : toggleClass(theme);
    setIsLoaded(true);

    return () => {
      toggleClass(theme);
    };
  }, [theme, mode, toggleClass]);

  return <>{isLoaded && children}</>;
};

export default ThemeProvider;
