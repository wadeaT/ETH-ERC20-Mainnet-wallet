// src/components/shared/PasswordField.js
'use client';

import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export function PasswordField({ 
  value, 
  onChange, 
  label = 'Password',
  placeholder = 'Enter password',
  error,
  showRequirements = false
}) {
  const [showPassword, setShowPassword] = useState(false);

  const requirements = [
    { text: 'At least 8 characters', met: value.length >= 8 },
    { text: 'Include numbers', met: /\d/.test(value) },
    { text: 'Include special characters', met: /[!@#$%^&*]/.test(value) }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-input/50 border border-input rounded-lg px-4 py-2 
            text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {showRequirements && (
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