// src/components/auth/PasswordResetForm.js
import { Button } from '@/components/ui/Button';
import { SecurityNotice } from '@/components/common/SecurityNotice';

export function PasswordResetForm({ 
  email, 
  onEmailChange, 
  onSubmit, 
  isLoading, 
  error, 
  success 
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <SecurityNotice type="error">
          {error}
        </SecurityNotice>
      )}

      {success && (
        <SecurityNotice type="info" title="Reset instructions sent!">
          Please check your email for further instructions to reset your password.
        </SecurityNotice>
      )}

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={onEmailChange}
          className="w-full bg-input/50 border border-input rounded-md px-4 py-2 
            text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          placeholder="Enter your email"
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading || !email.trim()}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            <span>Sending...</span>
          </div>
        ) : (
          'Send Reset Instructions'
        )}
      </Button>
    </form>
  );
}