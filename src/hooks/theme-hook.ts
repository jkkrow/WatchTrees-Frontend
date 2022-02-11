import { useCallback, useEffect } from 'react';

import { useLocalStorage } from './storage-hook';

type Theme = 'light' | 'dark';

export const useTheme = (theme?: Theme): [Theme, (value: Theme) => void] => {
  const [mode, setMode] = useLocalStorage('theme', 'light') as [
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

  useEffect(() => {
    toggleClass(theme || mode);

    return () => {
      toggleClass(mode);
    };
  }, [mode, toggleClass, theme]);

  return [mode, setTheme];
};
