// src/components/ui/Loading.js
'use client';

import { cn } from '@/lib/utils';

export const LoadingSpinner = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('flex justify-center items-center', className)}>
      <div className={cn(
        'border-4 border-primary/20 border-t-primary rounded-full animate-spin',
        sizeClasses[size]
      )} />
    </div>
  );
};

export const LoadingCard = ({ className }) => (
  <div className={cn('p-6 animate-pulse bg-muted/50 rounded-lg', className)}>
    <div className="h-4 bg-muted rounded w-2/3 mb-4" />
    <div className="h-4 bg-muted rounded w-1/2" />
  </div>
);