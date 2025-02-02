// src/components/wallet/RestoreWalletForm.js
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SecurityNotice } from '@/components/common/SecurityNotice';

export function RestoreWalletForm({ onRestore, isLoading, error }) {
  const [recoveryPhrase, setRecoveryPhrase] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRestore(recoveryPhrase);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRecoveryPhrase(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 p-4 bg-blue-900/20 rounded-lg">
        <p className="text-muted-foreground text-sm">
          Enter your 12-word recovery phrase to restore your wallet. 
          Make sure to enter the words in the correct order, separated by spaces.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={recoveryPhrase}
          onChange={(e) => setRecoveryPhrase(e.target.value)}
          placeholder="Enter your 12-word recovery phrase..."
          className="w-full h-32 bg-card/50 border border-border rounded-lg p-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
        />

        {error && (
          <SecurityNotice type="error">{error}</SecurityNotice>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handlePaste}
            className="flex-1 bg-card hover:bg-card/80"
          >
            📋 Paste Phrase
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={!recoveryPhrase.trim() || isLoading}
          >
            {isLoading ? 'Restoring...' : '🔑 Restore Wallet'}
          </Button>
        </div>
      </form>

      <SecurityNotice type="warning" title="Security Warning">
        Never share your recovery phrase with anyone. Double-check that you're entering 
        the correct 12 words in the exact order they were provided.
      </SecurityNotice>
    </div>
  );
}