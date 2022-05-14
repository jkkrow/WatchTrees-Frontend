import { useCallback } from 'react';

import { useLocalStorage } from './storage';
import { Theme } from 'providers/ThemeProvider';

export const useTheme = () => {
  const [mode, setMode] = useLocalStorage('theme', 'dark') as [
    Theme,
    (value: Theme) => void
  ];

  const toggleClass = useCallback((theme: Theme) => {
    document.documentElement.className = `theme-${theme}`;
  }, []);

  const setTheme = useCallback(
    (theme: Theme) => {
      toggleClass(theme);
      setMode(theme);
    },
    [setMode, toggleClass]
  );

  return { theme: mode, setTheme, toggleClass };
};
