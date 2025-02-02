// src/components/ui/Button.js
'use client';

import { cn } from '@/lib/utils';
import { LoadingSpinner } from './Loading';

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-muted/50',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-muted',
  link: 'text-primary underline-offset-4 hover:underline'
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4',
  lg: 'h-12 px-6 text-lg'
};

export const Button = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-md font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:opacity-50 disabled:pointer-events-none',
      variants[variant],
      sizes[size],
      className
    )}
    disabled={isLoading || props.disabled}
    {...props}
  >
    {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
    {!isLoading && leftIcon}
    {children}
    {!isLoading && rightIcon}
  </button>
);