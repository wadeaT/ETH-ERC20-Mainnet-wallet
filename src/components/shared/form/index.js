// src/components/shared/form/index.js
'use client';

import { useState } from 'react';

export function FormInput({ 
  label,
  type = 'text',
  error,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          className={`w-full bg-input/50 border ${
            error ? 'border-destructive' : 'border-input'
          } rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground
          focus:outline-none focus:border-primary`}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? '👁' : '👁‍🗨'}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

export function FormError({ message }) {
  if (!message) return null;
  
  return (
    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
      {message}
    </div>
  );
}

export function FormSuccess({ message }) {
  if (!message) return null;

  return (
    <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
      {message}
    </div>
  );
}

export function FormSection({ title, children, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
      )}
      {children}
    </div>
  );
}