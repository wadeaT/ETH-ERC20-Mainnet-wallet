// src/components/ui/ThemeToggle.js
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { Button } from './Button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card hover:bg-secondary"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-5 w-5 text-yellow-500" />
          <span className="text-sm text-foreground">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 text-blue-500" />
          <span className="text-sm text-foreground">Dark</span>
        </>
      )}
    </Button>
  );
}