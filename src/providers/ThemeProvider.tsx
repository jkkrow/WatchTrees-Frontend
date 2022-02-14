import { useEffect } from 'react';

import { useTheme } from 'hooks/theme-hook';

export type Theme = 'light' | 'dark';

interface ThemeProps {
  mode?: Theme;
}

const ThemeProvider: React.FC<ThemeProps> = ({ mode, children }) => {
  const { theme, toggleClass } = useTheme();

  useEffect(() => {
    mode ? toggleClass(mode) : toggleClass(theme);

    return () => {
      toggleClass(theme);
    };
  }, [theme, mode, toggleClass]);

  return <>{children}</>;
};

export default ThemeProvider;
