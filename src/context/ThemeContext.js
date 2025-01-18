// src/context/ThemeContext.js
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => null
});

// Theme initialization function
const initializeTheme = () => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    return initialTheme;
  }
  return 'dark'; // Default theme for server-side rendering
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialTheme = initializeTheme();
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark');
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};