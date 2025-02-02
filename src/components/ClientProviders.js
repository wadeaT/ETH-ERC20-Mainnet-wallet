// src/components/ClientProviders.js
'use client';

import { ThemeProvider } from './ThemeProvider';
import { ToastProvider } from './ui/Toast';

export default function ClientProviders({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}