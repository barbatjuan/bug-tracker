import { useState, useEffect } from 'react';
import { getTheme, setTheme as saveTheme } from '../utils/storage';

export const useTheme = () => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = getTheme();
    setThemeState(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    saveTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    setTheme,
    toggleTheme,
  };
};