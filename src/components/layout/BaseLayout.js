// src/components/layout/BaseLayout.js
'use client';

import { Header } from './Header';
import { ThemeProvider } from '../ThemeProvider';
import { motion } from 'framer-motion';

export function BaseLayout({ 
  children, 
  showBackButton = false,
  className = '',
  showHeader = true
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {showHeader && <Header showBackButton={showBackButton} />}
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`px-4 max-w-7xl mx-auto ${className}`}
        >
          {children}
        </motion.main>

        {/* Background Effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-primary rounded-full filter blur-3xl opacity-10" />
          <div className="absolute top-1/2 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-primary rounded-full filter blur-3xl opacity-10" />
        </div>
      </div>
    </ThemeProvider>
  );
}