// src/components/wallet/AccountForm.js
'use client';

import { Button } from '@/components/ui/Button';
import { AccountRequirements } from './AccountRequirements';

export function AccountForm({ 
  formData, 
  showPassword, 
  showConfirmPassword, 
  error, 
  isLoading, 
  onInputChange, 
  onTogglePassword,
  onToggleConfirmPassword,
  onSubmit 
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Create Your Wallet Account</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={onInputChange}
              className="w-full bg-input/50 border border-input rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={onInputChange}
                className="w-full bg-input/50 border border-input rounded-md px-4 py-2"
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? "👁" : "👁‍🗨"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={onInputChange}
                className="w-full bg-input/50 border border-input rounded-md px-4 py-2"
              />
              <button
                type="button"
                onClick={onToggleConfirmPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? "👁" : "👁‍🗨"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card/30 rounded-lg p-4">
          <h3 className="text-primary font-medium mb-4">Account Requirements</h3>
          <AccountRequirements formData={formData} />
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
          {error}
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Creating Account...' : 'Continue →'}
      </Button>
    </div>
  );
}