// src/app/ClientProvider.js
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function ClientProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

/*
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export default function ClientProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(
    () => 
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 30000,
          },
        },
      })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {mounted ? children : null}
    </QueryClientProvider>
  );
}*/