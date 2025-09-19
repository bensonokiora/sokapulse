"use client";

import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('theme') || 'light';
      setTheme(storedTheme);
      document.body.dataset.theme = storedTheme;
    } catch (error) {
      // Handle case where localStorage is not available (SSR)
      console.log('Theme storage access error:', error);
      document.body.dataset.theme = 'light';
    }
  }, []);

  const toggleTheme = () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.body.dataset.theme = newTheme;
    } catch (error) {
      // Handle case where localStorage is not available
      console.log('Theme toggle error:', error);
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      document.body.dataset.theme = newTheme;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};