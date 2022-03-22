import { useState, useCallback } from 'react';

export const useSettings = () => {
  const [displaySettings, setDisplaySettings] = useState(false);

  const toggleSettings = useCallback(() => {
    setDisplaySettings((prev) => !prev);
  }, []);

  return { displaySettings, setDisplaySettings, toggleSettings };
};
