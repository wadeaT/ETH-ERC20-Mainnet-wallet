// src/components/common/FormField.js
'use client';

import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FormField({
  label,
  type = 'text',
  error,
  showRequirements,
  requirements = [],
  className,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={cn(
            'w-full bg-input/50 border rounded-lg px-4 py-2',
            'text-foreground placeholder-muted-foreground',
            'focus:outline-none focus:border-primary',
            error ? 'border-destructive' : 'border-input',
            isPassword ? 'pr-10' : ''
          )}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {showRequirements && requirements.length > 0 && (
        <div className="space-y-1 mt-2">
          {requirements.map((req, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className={req.met ? 'text-success' : 'text-muted-foreground'}>
                {req.met ? '✓' : '○'}
              </span>
              <span className={req.met ? 'text-foreground' : 'text-muted-foreground'}>
                {req.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Password field with built-in requirements
export function PasswordField({ value = '', ...props }) {
  const requirements = [
    { text: 'At least 8 characters', met: value.length >= 8 },
    { text: 'Include numbers', met: /\d/.test(value) },
    { text: 'Include special characters', met: /[!@#$%^&*]/.test(value) }
  ];

  return (
    <FormField
      type="password"
      requirements={requirements}
      value={value}
      {...props}
    />
  );
}