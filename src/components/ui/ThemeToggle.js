// src/components/ui/ThemeToggle.js
'use client';

import { motion } from 'framer-motion';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'cyberpunk' : 'light');
  };

  const icons = {
    light: <Sun className="w-5 h-5" />,
    dark: <Moon className="w-5 h-5" />,
    cyberpunk: <Sparkles className="w-5 h-5" />
  };

  const colors = {
    light: 'bg-amber-100/50 text-amber-600 hover:bg-amber-100',
    dark: 'bg-primary/10 text-primary hover:bg-primary/20',
    cyberpunk: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl transition-colors ${colors[theme]}`}
      title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'cyberpunk' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        <motion.div
          initial={false}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {icons[theme]}
        </motion.div>
      </div>
    </motion.button>
  );
}