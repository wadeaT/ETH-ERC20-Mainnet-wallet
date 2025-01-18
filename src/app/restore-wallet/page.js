// src/app/restore-wallet/page.js
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { CommonHeader } from '@/components/layout/CommonHeader';

export default function RestoreWallet() {
  const router = useRouter();
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [restoredAddress, setRestoredAddress] = useState('');

  const handleRestore = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Validate recovery phrase
      const words = recoveryPhrase.trim().split(' ');
      if (words.length !== 12 && words.length !== 24) {
        throw new Error('Please enter a valid 12 or 24-word recovery phrase');
      }

      // Create wallet from recovery phrase
      const wallet = ethers.Wallet.fromPhrase(recoveryPhrase.trim());
      console.log('Wallet restored:', wallet.address);
      
      // Store wallet info in localStorage (or you could use session storage)
      window.localStorage.setItem('walletAddress', wallet.address);
      window.localStorage.setItem('privateKey', wallet.privateKey);

      setRestoredAddress(wallet.address);
      
      // Clear sensitive data from state
      setRecoveryPhrase('');
      
      // Redirect to dashboard after a short delay to show the success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Error restoring wallet:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRecoveryPhrase(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      setError('Failed to paste from clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <CommonHeader />

      <main className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-400 mb-8 text-center">
          Restore Your Wallet
        </h2>

        <Card className="bg-card/50 backdrop-blur-sm p-8">
          <div className="mb-6 p-4 bg-blue-900/20 rounded-lg">
            <p className="text-muted-foreground text-sm">
              Enter your recovery phrase (12 or 24 words) to restore your wallet. You don't need an account - just your recovery phrase.
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              value={recoveryPhrase}
              onChange={(e) => setRecoveryPhrase(e.target.value)}
              placeholder="Enter your recovery phrase..."
              className="w-full h-32 bg-card/50 border border-border rounded-lg p-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
            />

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {restoredAddress && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                Wallet restored successfully! Address: {restoredAddress.slice(0, 6)}...{restoredAddress.slice(-4)}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={handlePaste}
                className="flex-1 bg-card hover:bg-card/80"
              >
                📋 Paste Phrase
              </Button>
              <Button
                variant="primary"
                onClick={handleRestore}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!recoveryPhrase.trim() || isLoading}
              >
                {isLoading ? 'Restoring...' : '🔑 Restore Wallet'}
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-8 p-4 bg-red-900/20 border border-red-900/50 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-red-400">⚠️</span>
            <div>
              <h3 className="text-red-400 font-medium mb-2">Security Warning</h3>
              <p className="text-muted-foreground text-sm">
                Never share your recovery phrase with anyone. We will never ask for it through
                email, phone calls, or social media. Only enter your recovery phrase in the official
                ETH Wallet app.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}