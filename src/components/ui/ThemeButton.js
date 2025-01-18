// src/components/ui/ThemeButton.js
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';

export function ThemeButton({ className = '' }) {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors ${className}`}
      suppressHydrationWarning
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
}