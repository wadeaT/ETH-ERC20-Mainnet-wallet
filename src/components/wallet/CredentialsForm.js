// src/components/wallet/CredentialsForm.js
import { Button } from '@/components/ui/Button';
import { SecurityNotice } from '@/components/common/SecurityNotice';
import { PasswordField } from '../shared/PasswordField';

export function CredentialsForm({ 
  credentials, 
  onChange, 
  onSubmit, 
  isLoading, 
  error,
  walletAddress 
}) {
  return (
    <div className="space-y-6">
      <div className="mb-6 p-4 bg-blue-900/20 rounded-lg">
        <p className="text-muted-foreground text-sm">
          Wallet restored successfully! Set up your account credentials to continue.
          Your address: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Username
          </label>
          <input
            type="text"
            value={credentials.username}
            onChange={e => onChange({ ...credentials, username: e.target.value })}
            className="w-full bg-card/50 border border-border rounded-lg p-3 text-foreground"
            placeholder="Choose a username"
          />
        </div>

        <PasswordField
          value={credentials.password}
          onChange={e => onChange({ ...credentials, password: e.target.value })}
          label="Password"
          showRequirements
        />

        <PasswordField
          value={credentials.confirmPassword}
          onChange={e => onChange({ ...credentials, confirmPassword: e.target.value })}
          label="Confirm Password"
        />

        {error && <SecurityNotice type="error">{error}</SecurityNotice>}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Complete Setup'}
        </Button>
      </form>
    </div>
  );
}