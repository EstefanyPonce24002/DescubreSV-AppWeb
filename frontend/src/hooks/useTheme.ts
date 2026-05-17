import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('descubresv-theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('descubresv-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
  setTheme((prev: 'dark' | 'light') => (prev === 'dark' ? 'light' : 'dark'));
  
  return { theme, toggleTheme };
};